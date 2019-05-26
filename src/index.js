const knex = require("knex")
const Koa = require("koa")
const compose = require("koa-compose")
const bodyParser = require("koa-bodyparser")

const knexConfig = require("./knexfile")
const { routes } = require("./routes")

const app = new Koa()

app.context.db = knex(knexConfig[process.env.NODE_ENV || "development"])

app.use(
  compose([
    async (ctx, next) => {
      try {
        await next()
      } catch (error) {
        ctx.status = error.isJoi ? 400 : error.status || 500

        ctx.body = {
          message: error.isJoi ? error.details[0].message : error.message,
        }

        ctx.app.emit("error", error, ctx)
      }
    },
    bodyParser({ enableTypes: ["json"] }),
    ...routes,
  ]),
)

app.listen(process.env.PORT, () =>
  console.log(`Listening on ${process.env.PORT}`),
)
