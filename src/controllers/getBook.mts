import { type Middleware } from "@koa/router"

import { validateId } from "../joi.mts"
import { Book } from "../models.mts"

export const getBook: Middleware = async ctx => {
  ctx.body = await Book.findByPk(await validateId(ctx))

  if (!ctx.body) {
    ctx.throw(404, "Книга не существует")
  }
}
