import { randomUUIDv7 } from "node:crypto"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { Client } from "pg"
import { beforeAll, beforeEach } from "vitest"

beforeAll(async () => {
  const templateDbUrl = new URL(process.env.DATABASE_URL as string)

  const client = await new Client(
    new URL("/postgres", templateDbUrl).href,
  ).connect()

  const templateDbName = templateDbUrl.pathname.slice(1)

  const workerDbName = `${templateDbName}${process.env.VITEST_POOL_ID}`

  const workerDbUrl = new URL(`/${workerDbName}`, templateDbUrl)

  await client.query(`drop database if exists ${workerDbName} with (force)`)

  await client.query(
    `create database ${workerDbName} with template ${templateDbName}`,
  )

  await client.end()

  process.env.DATABASE_URL = workerDbUrl.href

  const { server } = await import("../server.mts")

  const { promise, resolve } = Promise.withResolvers<void>()

  server.listen(join(tmpdir(), `${randomUUIDv7()}.sock`), resolve)

  await promise

  const { setupClient } = await import("./index.mts")

  setupClient(server.address() as string)

  return () => server[Symbol.asyncDispose]()
})

beforeEach(async () => {
  const { authors, books, db } = await import("../db.mts")

  await db.delete(books)

  await db.delete(authors)
})
