const Joi = require("@hapi/joi")
const uuid = require("uuid/v4")

const schema = Joi.object({
  author: Joi.string()
    .uuid()
    .required(),
  title: Joi.string()
    .trim()
    .required(),
  description: Joi.string()
    .trim()
    .required(),
  image: Joi.string().trim(),
})

exports.create = async ctx => {
  const { author, title, description, image } = await schema.validate(
    ctx.request.body,
  )

  const [rows] = await ctx.db.raw(
    `
      select * from authors where id = uuid_to_bin(:id)
    `,
    { id: author },
  )

  if (rows.length === 0) {
    ctx.throw(404, "Автор не существует")
  }

  const data = {
    id: uuid(),
    author,
    title,
    description,
    image: image || null,
  }

  await ctx.db.raw(
    `
      insert into books (
        id,
        author,
        title,
        description,
        image
      ) values (
        uuid_to_bin(:id),
        uuid_to_bin(:author),
        :title,
        :description,
        :image
      )
    `,
    data,
  )

  ctx.status = 201

  ctx.body = { book: data }
}
