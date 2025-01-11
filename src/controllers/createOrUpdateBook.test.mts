import { randomUUIDv7 } from "node:crypto"

import { expect, it } from "vitest"

import {
  createBook,
  postAuthor,
  postBook,
  putBook,
} from "../testUtils/index.mts"

it("should create book", async () => {
  const { data: author } = await postAuthor()

  await expect(
    postBook({ authorId: randomUUIDv7(), title: "foo", description: "foo" }),
  ).resolves.toMatchObject({
    data: { message: "Автор не существует" },
    status: 404,
  })

  await expect(
    postBook({ authorId: author.id, title: "foo", description: "foo" }),
  ).resolves.toMatchObject({ data: { id: expect.any(String) }, status: 201 })
})

it("should update book", async () => {
  const book = await createBook()

  await expect(
    putBook(randomUUIDv7(), { image: "foo" }),
  ).resolves.toMatchObject({
    data: { message: "Книга не существует" },
    status: 404,
  })

  await expect(
    putBook(book.id, { authorId: randomUUIDv7() }),
  ).resolves.toMatchObject({
    data: { message: "Автор не существует" },
    status: 404,
  })

  await expect(putBook(book.id, { image: "foo" })).resolves.toMatchObject({
    data: "",
    status: 204,
  })
})
