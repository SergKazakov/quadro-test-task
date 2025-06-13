import { type RouterContext } from "@koa/router"
import Joi from "joi"

const joi = Joi.defaults(s => s.options({ stripUnknown: true }))

const uuidSchema = joi.string().uuid()

const stringSchema = joi.string().trim()

export const validateId = (ctx: RouterContext) =>
  uuidSchema.validateAsync(ctx.params.id)

export const schemaToCreateAuthor = joi.object({
  firstName: stringSchema.required(),
  lastName: stringSchema.required(),
})

export const schemaToCreateBook = joi.object({
  authorId: uuidSchema.required(),
  title: stringSchema.required(),
  description: stringSchema.required(),
  image: stringSchema,
})

export const schemaToUpdateBook = joi
  .object({
    authorId: uuidSchema,
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
      authorId: uuidSchema,
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
          joi.valid("id", "title", "description", "image").required(),
          joi.valid("asc", "desc").required(),
        ),
    )
    .default([["id", "desc"]]),
})
