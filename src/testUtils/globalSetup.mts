import { PostgreSqlContainer } from "@testcontainers/postgresql"

export default async function globalSetup() {
  const container = await new PostgreSqlContainer("postgres:18.4-alpine3.24")
    .withCopyDirectoriesToContainer([
      { source: "./src/migrations", target: "/docker-entrypoint-initdb.d" },
    ])
    .start()

  process.env.DATABASE_URL = container.getConnectionUri()

  return async () => {
    await container.stop()
  }
}
