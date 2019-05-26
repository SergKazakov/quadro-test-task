const Router = require("koa-router")

const { create } = require("../controllers/books/create")
const { getAll } = require("../controllers/books/getAll")
const { get } = require("../controllers/books/get")
const { update } = require("../controllers/books/update")
const { remove } = require("../controllers/books/remove")

exports.books = new Router({ prefix: "/api" })
  .post("/books", create)
  .get("/books", getAll)
  .get("/books/:id", get)
  .put("/books/:id", update)
  .delete("/books/:id", remove)
