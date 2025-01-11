import { randomUUIDv7 } from "node:crypto"

import { expect, it } from "vitest"

import { createBook, getBook } from "../testUtils/index.mts"

it("should get book", async () => {
  const book = await createBook()

  await expect(getBook(randomUUIDv7())).resolves.toMatchObject({
    data: { message: "Книга не существует" },
    status: 404,
  })

  await expect(getBook(book.id)).resolves.toMatchObject({
    data: { id: expect.any(String) },
    status: 200,
  })
})
