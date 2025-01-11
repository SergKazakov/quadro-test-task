import { type AddressInfo } from "node:net"

import { Client } from "pg"
import { beforeAll, beforeEach } from "vitest"

beforeAll(async () => {
  const templateDbUrl = new URL(process.env.DATABASE_URL as string)

  const adminDbUrl = new URL(templateDbUrl)

  adminDbUrl.pathname = "/postgres"

  const client = await new Client(adminDbUrl.href).connect()

  const templateDbName = templateDbUrl.pathname.slice(1)

  const workerDbName = `${templateDbName}${process.env.VITEST_POOL_ID}`

  const workerDbUrl = new URL(templateDbUrl)

  workerDbUrl.pathname = `/${workerDbName}`

  await client.query(`drop database if exists ${workerDbName} with (force)`)

  await client.query(
    `create database ${workerDbName} with template ${templateDbName}`,
  )

  await client.end()

  process.env.DATABASE_URL = workerDbUrl.href

  const { server } = await import("../server.mts")

  const { promise, resolve } = Promise.withResolvers<void>()

  server.listen(0, resolve)

  await promise

  const { setupClient } = await import("./index.mts")

  setupClient((server.address() as AddressInfo).port)

  return async () => {
    const { promise, resolve } = Promise.withResolvers<void>()

    server.close(() => resolve())

    await promise
  }
})

beforeEach(async () => {
  const { authors, books, db } = await import("../db.mts")

  await db.delete(books)

  await db.delete(authors)
})
