import { PostgreSqlContainer } from "@testcontainers/postgresql"

export const setup = async () => {
  const container = await new PostgreSqlContainer("postgres:17.4-alpine")
    .withCopyDirectoriesToContainer([
      { source: "./src/migrations", target: "/docker-entrypoint-initdb.d" },
    ])
    .start()

  process.env.DATABASE_URL = container.getConnectionUri()

  return async () => {
    await container.stop()
  }
}
