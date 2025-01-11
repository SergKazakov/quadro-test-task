import { schemaToCreateBook, schemaToUpdateBook, validateId } from "../joi.mjs"
import { Book } from "../models.mjs"

export const createOrUpdateBook = async ctx => {
  const id = await validateId(ctx)

  const body = await (
    id === undefined ? schemaToCreateBook : schemaToUpdateBook
  ).validateAsync(ctx.request.body)

  try {
    if (id === undefined) {
      ctx.body = await Book.create(body)

      ctx.status = 201
    } else {
      const [rowCount] = await Book.update(body, { where: { id } })

      if (rowCount === 0) {
        ctx.throw(404, "Книга не существует")
      }

      ctx.body = null
    }
  } catch (error) {
    if (error instanceof Error && error.index === "books_author_id_fkey") {
      ctx.throw(404, "Автор не существует")
    }

    throw error
  }
}
