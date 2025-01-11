import { schemaToCreateAuthor } from "../joi.mjs"
import { Author } from "../models.mjs"

export const createAuthor = async ctx => {
  const body = await schemaToCreateAuthor.validateAsync(ctx.request.body)

  ctx.body = await Author.create(body)

  ctx.status = 201
}
