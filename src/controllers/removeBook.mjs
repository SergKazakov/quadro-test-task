import { validateId } from "../joi.mjs"
import { Book } from "../models.mjs"

export const removeBook = async ctx => {
  const rowCount = await Book.destroy({ where: { id: await validateId(ctx) } })

  if (rowCount === 0) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.body = null
}
