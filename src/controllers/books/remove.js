const Joi = require("@hapi/joi")

exports.remove = async ctx => {
  await Joi.validate(
    ctx.params.id,
    Joi.string()
      .uuid()
      .required()
      .label("id"),
  )

  const [{ affectedRows }] = await ctx.db.raw(
    `
      delete from books where id = uuid_to_bin(:id)
    `,
    { id: ctx.params.id },
  )

  if (affectedRows === 0) {
    ctx.throw(404, "Книга не существует")
  }

  ctx.status = 204
}
