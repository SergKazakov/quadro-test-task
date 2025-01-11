import { Op } from "@sequelize/core"
import qs from "qs"

import { schemaToGetBooks } from "../joi.mjs"
import { Book } from "../models.mjs"

export const getAllBooks = async ctx => {
  const {
    page,
    perPage,
    filter: { createdAtGte, createdAtLte, authorId, title, description, image },
    sorting,
  } = await schemaToGetBooks.validateAsync(qs.parse(ctx.querystring))

  const where = {
    ...((createdAtGte || createdAtLte) && {
      createdAt: {
        ...(createdAtGte && { [Op.gte]: createdAtGte }),
        ...(createdAtLte && { [Op.lte]: createdAtLte }),
      },
    }),
    ...(authorId && { authorId }),
    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
    ...(description && { description: { [Op.iLike]: `%${description}%` } }),
    ...(image && { image: { [Op.iLike]: `%${image}%` } }),
  }

  const [total, rows] = await Promise.all([
    Book.count({ where }),
    Book.findAll({
      limit: perPage,
      offset: (page - 1) * perPage,
      where,
      order: sorting,
      raw: true,
    }),
  ])

  ctx.body = { rows, total }
}
