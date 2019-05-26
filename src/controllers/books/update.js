const Joi = require("@hapi/joi")

const schema = Joi.object({
  author: Joi.string().uuid(),
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  image: Joi.string()
    .trim()
    .allow(null),
}).min(1)

exports.update = async ctx => {
  await Joi.validate(
    ctx.params.id,
    Joi.string()
      .uuid()
      .required()
      .label("id"),
  )

  const data = await schema.validate(ctx.request.body)

  if (data.author) {
    const [rows] = await ctx.db.raw(
      `
        select * from authors where id = uuid_to_bin(:id)
      `,
      { id: data.author },
    )

    if (rows.length === 0) {
      ctx.throw(404, "Автор не существует")
    }
  }

  await ctx.db.raw(
    `
      update books set
      ${Object.keys(data)
        .map(
          key =>
            `${key} = ${key === "author" ? `uuid_to_bin(:${key})` : `:${key}`}`,
        )
        .join(",")}
      where id = uuid_to_bin(:id)
    `,
    { id: ctx.params.id, ...data },
  )

  ctx.status = 204
}
