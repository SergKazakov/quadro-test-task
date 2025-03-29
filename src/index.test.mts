import { type AddressInfo } from "node:net"
import { promisify } from "node:util"

import axios, { type AxiosInstance } from "axios"
import { beforeAll, expect, it } from "vitest"

import { type authors, type books } from "./db.mts"
import { server } from "./server.mts"

let client: AxiosInstance

beforeAll(async () => {
  await promisify(cb => server.listen(cb))()

  const address = server.address() as AddressInfo

  client = axios.create({
    baseURL: `http://127.0.0.1:${address.port}/api`,
    validateStatus: () => true,
  })

  return async () => {
    await promisify<void>(cb => server.close(cb))()
  }
})

it("should pass", async () => {
  const { data: author, status: status0 } = await client.post<
    typeof authors.$inferSelect
  >("/authors", { firstName: "foo", lastName: "foo" })

  const schema = { id: expect.any(Number) }

  expect(author).toMatchObject({
    ...schema,
    firstName: expect.any(String),
    lastName: expect.any(String),
  })

  expect(status0).toBe(201)

  const baseUrl = "/books"

  const { data: error, status: status1 } = await client.post(baseUrl, {
    authorId: 0,
    title: "foo",
    description: "foo",
  })

  const authorNotFound = "Автор не существует"

  expect(error).toMatchObject({ message: authorNotFound })

  expect(status1).toBe(404)

  const { data: book, status: status2 } = await client.post<
    typeof books.$inferSelect
  >(baseUrl, { authorId: author.id, title: "foo", description: "foo" })

  expect(book).toMatchObject({
    ...schema,
    authorId: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
    image: null,
  })

  expect(status2).toBe(201)

  {
    const { data } = await client(baseUrl)

    expect(data).toMatchObject({
      rows: expect.arrayContaining([expect.objectContaining(schema)]),
      total: expect.any(Number),
    })
  }

  {
    const { data } = await client(baseUrl, {
      params: {
        filter: {
          createdAtGte: book.createdAt,
          createdAtLte: book.createdAt,
          authorId: author.id,
          title: book.title,
          description: book.description,
          image: book.description,
        },
        sorting: [
          ["id", "asc"],
          ["title", "asc"],
          ["description", "asc"],
          ["image", "asc"],
        ],
      },
    })

    expect(data).toMatchObject({ rows: [], total: 0 })
  }

  const bookNotFound = "Книга не существует"

  for (const [id, expected, expectedStatus] of [
    [0, { message: bookNotFound }, 404],
    [book.id, schema, 200],
  ] as [number, object, number][]) {
    const { data, status } = await client(`${baseUrl}/${id}`)

    expect(data).toMatchObject(expected)

    expect(status).toBe(expectedStatus)
  }

  for (const [id, data, expected, expectedStatus] of [
    [0, {}, { message: bookNotFound }, 404],
    [book.id, { authorId: 0 }, { message: authorNotFound }, 404],
    [book.id, {}, "", 204],
  ] as [number, object, object, number][]) {
    const { data: d, status } = await client.put(`${baseUrl}/${id}`, {
      image: "foo",
      ...data,
    })

    expect(d).toMatchObject(expected)

    expect(status).toBe(expectedStatus)
  }

  for (const [expected, expectedStatus] of [
    ["", 204],
    [{ message: bookNotFound }, 404],
  ] as [string | object, number][]) {
    const { data, status } = await client.delete(`${baseUrl}/${book.id}`)

    if (typeof expected === "string") {
      expect(data).toBe(expected)
    } else {
      expect(data).toMatchObject(expected)
    }

    expect(status).toBe(expectedStatus)
  }
})
