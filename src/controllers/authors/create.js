const Joi = require("@hapi/joi")
const uuid = require("uuid/v4")

const schema = Joi.object({
  first_name: Joi.string()
    .trim()
    .required(),
  last_name: Joi.string()
    .trim()
    .required(),
})

exports.create = async ctx => {
  const { first_name: firstName, last_name: lastName } = await schema.validate(
    ctx.request.body,
  )

  const data = {
    id: uuid(),
    firstName,
    lastName,
  }

  await ctx.db.raw(
    `
      insert into authors (
        id,
        first_name,
        last_name
      ) values (
        uuid_to_bin(:id),
        :firstName,
        :lastName
      )
    `,
    data,
  )

  ctx.status = 201

  ctx.body = { author: data }
}
