const { URL } = require("url")

const { hostname, username, password, pathname } = new URL(
  process.env.DATABASE_URL,
)

module.exports = {
  [process.env.NODE_ENV || "development"]: {
    client: "mysql2",
    connection: {
      host: hostname,
      user: username,
      password,
      database: pathname.substring(1),
      multipleStatements: true,
    },
    debug: process.env.NODE_ENV !== "production",
  },
}
