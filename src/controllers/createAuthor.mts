import { type Middleware } from "@koa/router"

import { schemaToCreateAuthor } from "../joi.mts"
import { Author } from "../models.mts"

export const createAuthor: Middleware = async ctx => {
  const body = await schemaToCreateAuthor.validateAsync(ctx.request.body)

  ctx.body = await Author.create(body)

  ctx.status = 201
}
