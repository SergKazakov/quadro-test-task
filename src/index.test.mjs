import { promisify } from "node:util"

import { PostgreSqlContainer } from "@testcontainers/postgresql"
import axios from "axios"
import { afterAll, expect, it } from "vitest"

const container = await new PostgreSqlContainer("postgres:17.2")
  .withCopyDirectoriesToContainer([
    { source: "./src/migrations", target: "/docker-entrypoint-initdb.d" },
  ])
  .start()

process.env.__PG_URL__ = container.getConnectionUri()

const { server } = await import("./server.mjs")

await promisify(cb => server.listen(cb))()

afterAll(async () => {
  const { sequelize } = await import("./models.mjs")

  await Promise.all([
    container.stop(),
    sequelize.close(),
    promisify(cb => server.close(cb))(),
  ])
})

const client = axios.create({
  baseURL: `http://127.0.0.1:${server.address().port}/api`,
  validateStatus: () => true,
})

it("should pass", async () => {
  const { data: author, status: status0 } = await client.post("/authors", {
    firstName: "foo",
    lastName: "foo",
  })

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

  const { data: createdBook, status: status2 } = await client.post(baseUrl, {
    authorId: author.id,
    title: "foo",
    description: "foo",
  })

  expect(createdBook).toMatchObject({
    ...schema,
    authorId: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
    image: null,
  })

  expect(status2).toBe(201)

  const { data: books } = await client(baseUrl)

  expect(books).toMatchObject({
    rows: expect.arrayContaining([expect.objectContaining(schema)]),
    total: expect.any(Number),
  })

  const bookNotFound = "Книга не существует"

  for (const [id, expected, expectedStatus] of [
    [0, { message: bookNotFound }, 404],
    [createdBook.id, schema, 200],
  ]) {
    const { data, status } = await client(`${baseUrl}/${id}`)

    expect(data).toMatchObject(expected)

    expect(status).toBe(expectedStatus)
  }

  for (const [id, data, expected, expectedStatus] of [
    [0, {}, { message: bookNotFound }, 404],
    [createdBook.id, { authorId: 0 }, { message: authorNotFound }, 404],
    [createdBook.id, {}, "", 204],
  ]) {
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
  ]) {
    const { data, status } = await client.delete(`${baseUrl}/${createdBook.id}`)

    expect(data).toMatchObject(expected)

    expect(status).toBe(expectedStatus)
  }
})
