import { type RouterMiddleware } from "@koa/router"

import { books, db, eq } from "../db.mts"
import { validateId } from "../joi.mts"

export const getBook: RouterMiddleware = async ctx => {
  const [row] = await db
    .select()
    .from(books)
    .where(eq(books.id, await validateId(ctx)))

  if (!row) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.body = row
}
