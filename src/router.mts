import { bodyParser } from "@koa/bodyparser"
import Router from "@koa/router"

import { createAuthor } from "./controllers/createAuthor.mts"
import { createOrUpdateBook } from "./controllers/createOrUpdateBook.mts"
import { getAllBooks } from "./controllers/getAllBooks.mts"
import { getBook } from "./controllers/getBook.mts"
import { removeBook } from "./controllers/removeBook.mts"

const parseBody = bodyParser({ enableTypes: ["json"] })

export const router = new Router({ prefix: "/api" })
  .post("/authors", parseBody, createAuthor)
  .post("/books", parseBody, createOrUpdateBook)
  .get("/books", getAllBooks)
  .get("/books/:id", getBook)
  .put("/books/:id", parseBody, createOrUpdateBook)
  .delete("/books/:id", removeBook)
