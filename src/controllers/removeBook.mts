import { type Middleware } from "@koa/router"

import { validateId } from "../joi.mts"
import { Book } from "../models.mts"

export const removeBook: Middleware = async ctx => {
  const rowCount = await Book.destroy({ where: { id: await validateId(ctx) } })

  if (rowCount === 0) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.body = null
}
