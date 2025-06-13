import { PostgreSqlContainer } from "@testcontainers/postgresql"

export const setup = async () => {
  const container = await new PostgreSqlContainer("postgres:18beta1-alpine")
    .withCopyDirectoriesToContainer([
      { source: "./src/migrations", target: "/docker-entrypoint-initdb.d" },
    ])
    .withTmpFs({ "/var/lib/postgresql/18/docker": "" })
    .start()

  process.env.DATABASE_URL = container.getConnectionUri()

  return async () => {
    await container.stop()
  }
}
