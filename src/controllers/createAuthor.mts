import { type RouterMiddleware } from "@koa/router"

import { authors, db } from "../db.mts"
import { schemaToCreateAuthor } from "../joi.mts"

export const createAuthor: RouterMiddleware = async ctx => {
  const body = await schemaToCreateAuthor.validateAsync(ctx.request.body)

  const [row] = await db.insert(authors).values(body).returning()

  ctx.status = 201

  ctx.body = row
}
