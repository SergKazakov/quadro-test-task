import { type Middleware } from "@koa/router"

import { authors, db } from "../db.mts"
import { schemaToCreateAuthor } from "../joi.mts"

export const createAuthor: Middleware = async ctx => {
  const body = await schemaToCreateAuthor.validateAsync(ctx.request.body)

  ;[ctx.body] = await db.insert(authors).values(body).returning()

  ctx.status = 201
}
