import { type Middleware } from "@koa/router"

import { books, db, eq } from "../db.mts"
import { validateId } from "../joi.mts"

export const getBook: Middleware = async ctx => {
  ;[ctx.body] = await db
    .select()
    .from(books)
    .where(eq(books.id, await validateId(ctx)))

  if (!ctx.body) {
    ctx.throw(404, "Книга не существует")
  }
}
