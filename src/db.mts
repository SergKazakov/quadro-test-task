import { drizzle } from "drizzle-orm/node-postgres"
import * as t from "drizzle-orm/pg-core"

import { env } from "./env.mts"

const withId = { id: t.uuid("id").primaryKey() }

const withTimestamp = {
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}

export const authors = t.pgTable("authors", {
  ...withId,
  ...withTimestamp,
  firstName: t.text("first_name").notNull(),
  lastName: t.text("last_name").notNull(),
})

export const books = t.pgTable("books", {
  ...withId,
  ...withTimestamp,
  authorId: t
    .uuid("author_id")
    .notNull()
    .references(() => authors.id),
  title: t.text().notNull(),
  description: t.text().notNull(),
  image: t.text(),
})

export const db = drizzle(env.DATABASE_URL, {
  casing: "snake_case",
  logger: env.isDev,
})

export * from "drizzle-orm"
