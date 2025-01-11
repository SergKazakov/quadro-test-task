import { expect, it } from "vitest"

import { createBook, getBooks } from "../testUtils/index.mts"

it("should filter and sort books", async () => {
  const book = await createBook()

  await expect(getBooks()).resolves.toMatchObject({
    data: {
      rows: expect.arrayContaining([expect.objectContaining({ id: book.id })]),
      total: expect.any(Number),
    },
  })

  await expect(
    getBooks({
      filter: {
        createdAtGte: book.createdAt,
        createdAtLte: book.createdAt,
        authorId: book.authorId,
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
    }),
  ).resolves.toMatchObject({ data: { rows: [], total: 0 } })
})
