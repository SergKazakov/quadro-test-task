import { validateId } from "../joi.mjs"
import { Book } from "../models.mjs"

export const getBook = async ctx => {
  ctx.body = await Book.findByPk(await validateId(ctx))

  if (!ctx.body) {
    ctx.throw(404, "Книга не существует")
  }
}
