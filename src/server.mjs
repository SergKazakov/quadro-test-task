import { createServer } from "node:http"

import Joi from "joi"
import Koa, { HttpError } from "koa"

import { router } from "./router.mjs"

export const server = createServer(
  new Koa()
    .use(async (ctx, next) => {
      try {
        await next()
      } catch (error) {
        ctx.status = 500

        ctx.body = { message: "Неизвестная ошибка" }

        if (error instanceof Joi.ValidationError) {
          ctx.status = 400

          ctx.body.message = error.message
        } else if (error instanceof HttpError) {
          ctx.status = error.status

          ctx.body.message = error.message
        }
      }
    })
    .use(router.routes())
    .callback(),
)
