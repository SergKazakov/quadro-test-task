const Joi = require("@hapi/joi")

const schema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  count: Joi.number()
    .integer()
    .min(0)
    .default(10),
}).min(1)

exports.getAll = async ctx => {
  const { page, count } = await schema.validate(ctx.query)

  const [[{ total }]] = await ctx.db.raw(
    `
      select count(*) total
      from books
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
      order by created_at desc
      limit :limit offset :offset
    `,
    { offset: (page - 1) * count, limit: count },
  )

  ctx.body = { books: rows, total }
}
