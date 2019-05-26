const Joi = require("@hapi/joi")

exports.get = async ctx => {
  await Joi.validate(
    ctx.params.id,
    Joi.string()
      .uuid()
      .required()
      .label("id"),
  )

  const [[book]] = await ctx.db.raw(
    `
      select
        bin_to_uuid(id) id,
        bin_to_uuid(author) author,
        title,
        description,
        image,
        created_at,
        updated_at
      from books where id = uuid_to_bin(:id)
    `,
    { id: ctx.params.id },
  )

  if (!book) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.body = { book }
}
