import { type Middleware } from "@koa/router"
import { type PgColumn } from "drizzle-orm/pg-core"
import qs from "qs"

import { and, asc, books, db, desc, eq, gte, ilike, lte } from "../db.mts"
import { schemaToGetBooks } from "../joi.mts"

export const getBooks: Middleware = async ctx => {
  const {
    page,
    perPage,
    filter: { createdAtGte, createdAtLte, authorId, title, description, image },
    sorting,
  } = await schemaToGetBooks.validateAsync(qs.parse(ctx.querystring))

  const where = and(
    createdAtGte ? gte(books.createdAt, createdAtGte) : undefined,
    createdAtLte ? lte(books.createdAt, createdAtLte) : undefined,
    authorId ? eq(books.authorId, authorId) : undefined,
    title ? ilike(books.title, `%${title}%`) : undefined,
    description ? ilike(books.description, `%${description}%`) : undefined,
    image ? ilike(books.image, `%${image}%`) : undefined,
  )

  const orderBy = (sorting as [PgColumn, string][]).map(
    ([column, direction]) => (direction === "asc" ? asc(column) : desc(column)),
  )

  const [total, rows] = await Promise.all([
    db.$count(books, where),
    db
      .select()
      .from(books)
      .where(where)
      .orderBy(...orderBy)
      .limit(perPage)
      .offset((page - 1) * perPage),
  ])

  ctx.body = { rows, total }
}
