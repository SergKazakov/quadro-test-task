import { randomUUIDv7 } from "node:crypto"

import { expect, it } from "vitest"

import { createBook, deleteBook } from "../testUtils/index.mts"

it("should delete book", async () => {
  const book = await createBook()

  await expect(deleteBook(randomUUIDv7())).resolves.toMatchObject({
    data: { message: "Книга не существует" },
    status: 404,
  })

  await expect(deleteBook(book.id)).resolves.toMatchObject({
    data: "",
    status: 204,
  })
})
