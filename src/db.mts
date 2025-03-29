import { drizzle } from "drizzle-orm/node-postgres"
import * as t from "drizzle-orm/pg-core"

const withId = { id: t.integer().generatedAlwaysAsIdentity().primaryKey() }

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
    .integer("author_id")
    .notNull()
    .references(() => authors.id),
  title: t.text().notNull(),
  description: t.text().notNull(),
  image: t.text(),
})

export const db = drizzle(process.env.DATABASE_URL as string, {
  casing: "snake_case",
  logger: process.env.NODE_ENV === undefined,
})

export * from "drizzle-orm"
