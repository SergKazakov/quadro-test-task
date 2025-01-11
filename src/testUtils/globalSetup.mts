import { GenericContainer, Wait } from "testcontainers"

export default async function globalSetup() {
  const container = await new GenericContainer("postgres:18-alpine")
    .withEnvironment({
      POSTGRES_DB: "quadro",
      POSTGRES_HOST_AUTH_METHOD: "trust",
    })
    .withExposedPorts(5432)
    .withTmpFs({ "/var/lib/postgresql/18/docker": "rw" })
    .withCopyDirectoriesToContainer([
      { source: "./src/migrations", target: "/docker-entrypoint-initdb.d" },
    ])
    .withWaitStrategy(
      Wait.forLogMessage(/database system is ready to accept connections/, 2),
    )
    .start()

  process.env.DATABASE_URL = `postgres://postgres@${container.getHost()}:${container.getMappedPort(5432)}/quadro`

  return () => container.stop()
}
