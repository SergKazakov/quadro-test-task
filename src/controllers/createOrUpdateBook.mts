import { type RouterMiddleware } from "@koa/router"
import { DatabaseError } from "pg"

import { books, db, eq, sql } from "../db.mts"
import { schemaToCreateBook, schemaToUpdateBook, validateId } from "../joi.mts"

export const createOrUpdateBook: RouterMiddleware = async ctx => {
  const id = await validateId(ctx)

  const body = await (
    id ? schemaToUpdateBook : schemaToCreateBook
  ).validateAsync(ctx.request.body)

  try {
    if (id) {
      const [row] = await db
        .update(books)
        .set({ ...body, updatedAt: sql`now()` })
        .where(eq(books.id, id))
        .returning()

      if (!row) {
        ctx.throw(404, "Книга не существует")
      }

      ctx.body = null
    } else {
      const [row] = await db.insert(books).values(body).returning()

      ctx.status = 201

      ctx.body = row
    }
  } catch (error) {
    if (
      error instanceof Error
      && error.cause instanceof DatabaseError
      && error.cause.constraint === "books_author_id_fkey"
    ) {
      ctx.throw(404, "Автор не существует")
    }

    throw error
  }
}
