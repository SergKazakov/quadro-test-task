const Router = require("koa-router")

const { create } = require("../controllers/authors/create")

exports.authors = new Router({ prefix: "/api" }).post("/authors", create)
