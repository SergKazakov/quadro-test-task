const Joi = require("@hapi/joi")

const schema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  count: Joi.number()
    .integer()
    .min(0)
    .default(100),
  filter: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    image: Joi.string().trim(),
    author: Joi.string().uuid(),
    created_at: Joi.object({
      gte: Joi.date(),
      lte: Joi.date(),
    }),
  }).default({}),
  sorting: Joi.array()
    .items(
      Joi.array().ordered(
        Joi.string()
          .valid("title", "description", "image", "created_at")
          .required(),
        Joi.string()
          .valid(["asc", "desc"])
          .required(),
      ),
    )
    .min(1)
    .default([["created_at", "desc"]]),
}).min(1)

exports.getAll = async ctx => {
  const { page, count, filter, sorting } = await schema.validate(ctx.query)

  const where = Object.entries(filter)
    .reduce((res, [key, value]) => {
      if (["title", "description", "image"].includes(key)) {
        return [...res, `${key} like lower('%${value}%')`]
      }

      if (key === "author") {
        return [...res, `${key} = uuid_to_bin('${value}')`]
      }

      if (key === "created_at") {
        const gte = value.gte ? value.gte.toISOString() : undefined

        const lte = value.lte ? value.lte.toISOString() : undefined

        if (gte && lte) {
          return [...res, `(${key} >= '${gte}' and ${key} <= '${lte}')`]
        }

        if (gte) {
          return [...res, `${key} >= '${gte}'`]
        }

        if (lte) {
          return [...res, `${key} <= '${lte}'`]
        }
      }

      return res
    }, [])
    .join(" and ")

  const [[{ total }]] = await ctx.db.raw(
    `
      select count(*) total
      from books
      ${where ? `where ${where}` : ""}
    `,
  )

  if (total === 0) {
    ctx.body = { books: [], total }

    return
  }

  const [rows] = await ctx.db.raw(
    `
      select
        bin_to_uuid(id) id,
        bin_to_uuid(author) author,
        title,
        description,
        image,
        created_at,
        updated_at
      from books
      ${where ? `where ${where}` : ""}
      order by ${sorting.map(([x, y]) => `${x} ${y}`).join(",")}
      limit :limit offset :offset
    `,
    { offset: (page - 1) * count, limit: count },
  )

  ctx.body = { books: rows, total }
}
