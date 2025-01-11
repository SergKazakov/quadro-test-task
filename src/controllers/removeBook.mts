import { type RouterMiddleware } from "@koa/router"

import { books, db, eq } from "../db.mts"
import { validateId } from "../joi.mts"

export const removeBook: RouterMiddleware = async ctx => {
  const [row] = await db
    .delete(books)
    .where(eq(books.id, await validateId(ctx)))
    .returning()

  if (!row) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.body = null
}
