import { type Middleware } from "@koa/router"
import { DatabaseError } from "pg"

import { books, db, eq, sql } from "../db.mts"
import { schemaToCreateBook, schemaToUpdateBook, validateId } from "../joi.mts"

export const createOrUpdateBook: Middleware = async ctx => {
  const id = await validateId(ctx)

  const body = await (
    id === undefined ? schemaToCreateBook : schemaToUpdateBook
  ).validateAsync(ctx.request.body)

  try {
    if (id === undefined) {
      ;[ctx.body] = await db.insert(books).values(body).returning()

      ctx.status = 201
    } else {
      const rows = await db
        .update(books)
        .set({ ...body, updatedAt: sql`now()` })
        .where(eq(books.id, id))
        .returning()

      if (rows.length === 0) {
        ctx.throw(404, "Книга не существует")
      }

      ctx.body = null
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.cause instanceof DatabaseError &&
      error.cause.constraint === "books_author_id_fkey"
    ) {
      ctx.throw(404, "Автор не существует")
    }

    throw error
  }
}
