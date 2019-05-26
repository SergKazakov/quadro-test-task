module.exports = {
  [process.env.NODE_ENV || "development"]: {
    client: "mysql2",
    connection: process.env.DATABASE_URL,
    debug: process.env.NODE_ENV !== "production",
  },
}
