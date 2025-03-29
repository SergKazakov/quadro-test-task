import { type Middleware } from "@koa/router"

import { books, db, eq } from "../db.mts"
import { validateId } from "../joi.mts"

export const removeBook: Middleware = async ctx => {
  const rows = await db
    .delete(books)
    .where(eq(books.id, await validateId(ctx)))
    .returning()

  if (rows.length === 0) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.body = null
}
