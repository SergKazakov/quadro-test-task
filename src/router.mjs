import { bodyParser } from "@koa/bodyparser"
import Router from "@koa/router"

import { createAuthor } from "./controllers/createAuthor.mjs"
import { createOrUpdateBook } from "./controllers/createOrUpdateBook.mjs"
import { getAllBooks } from "./controllers/getAllBooks.mjs"
import { getBook } from "./controllers/getBook.mjs"
import { removeBook } from "./controllers/removeBook.mjs"

const parseBody = bodyParser({ enableTypes: ["json"] })

export const router = new Router({ prefix: "/api" })
  .post("/authors", parseBody, createAuthor)
  .post("/books", parseBody, createOrUpdateBook)
  .get("/books", getAllBooks)
  .get("/books/:id", getBook)
  .put("/books/:id", parseBody, createOrUpdateBook)
  .delete("/books/:id", removeBook)
