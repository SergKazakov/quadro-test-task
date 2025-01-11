import Joi from "joi"

const MIN_INT_4 = -(2 ** 31)

const MAX_INT_4 = -MIN_INT_4 - 1

const joi = Joi.defaults(s => s.options({ stripUnknown: true })).extend({
  type: "int4",
  base: Joi.number().integer(),
  messages: { int4: "{{#label}} must be an int4" },
  validate: (value, helpers) =>
    value >= MIN_INT_4 && value <= MAX_INT_4
      ? { value }
      : { value, errors: helpers.error("int4") },
})

export const validateId = ctx => joi.int4().validateAsync(ctx.params.id)

const stringSchema = joi.string().trim()

export const schemaToCreateAuthor = joi.object({
  firstName: stringSchema.required(),
  lastName: stringSchema.required(),
})

export const schemaToCreateBook = joi.object({
  authorId: joi.int4().required(),
  title: stringSchema.required(),
  description: stringSchema.required(),
  image: stringSchema,
})

export const schemaToUpdateBook = joi
  .object({
    authorId: joi.int4(),
    title: stringSchema,
    description: stringSchema,
    image: stringSchema.allow(null),
  })
  .min(1)

export const schemaToGetBooks = joi.object({
  page: joi.number().integer().min(1).default(1),
  perPage: joi.number().integer().min(0).default(100),
  filter: joi
    .object({
      createdAtGte: joi.date().iso(),
      createdAtLte: joi.date().iso(),
      authorId: joi.int4(),
      title: stringSchema,
      description: stringSchema,
      image: stringSchema,
    })
    .default({}),
  sorting: joi
    .array()
    .items(
      joi
        .array()
        .ordered(
          joi.valid("title", "description", "image").required(),
          joi.valid("asc", "desc").required(),
        ),
    )
    .default([["id", "desc"]]),
})
