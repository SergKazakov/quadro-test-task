import { DataTypes, Sequelize } from "@sequelize/core"
import { PostgresDialect } from "@sequelize/postgres"
import config from "config"

export const sequelize = new Sequelize({
  define: { underscored: true },
  dialect: PostgresDialect,
  logging: process.env.NODE_ENV === undefined ? console.log : false,
  logQueryParameters: true,
  noTypeValidation: true,
  url: config.get("pgUrl"),
})

export const Author = sequelize.define(
  "author",
  { firstName: DataTypes.TEXT, lastName: DataTypes.TEXT },
  { tableName: "authors" },
)

export const Book = sequelize.define(
  "book",
  {
    authorId: DataTypes.INTEGER,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT,
  },
  { tableName: "books" },
)
