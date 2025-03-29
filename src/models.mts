/* eslint-disable lines-between-class-members */
/* eslint-disable new-cap */
import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  Sequelize,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy"
import { PostgresDialect } from "@sequelize/postgres"
import config from "config"

@Table({ tableName: "authors" })
export class Author extends Model<
  InferAttributes<Author>,
  InferCreationAttributes<Author>
> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  id: CreationOptional<number>

  createdAt: CreationOptional<Date>

  updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.TEXT)
  firstName: string

  @Attribute(DataTypes.TEXT)
  lastName: string
}

@Table({ tableName: "books" })
export class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  id: CreationOptional<number>

  createdAt: CreationOptional<Date>

  updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.INTEGER)
  authorId: number

  @Attribute(DataTypes.TEXT)
  title: string

  @Attribute(DataTypes.TEXT)
  description: string

  @Attribute(DataTypes.TEXT)
  image: string
}

export const sequelize = new Sequelize({
  define: { underscored: true },
  dialect: PostgresDialect,
  logging: process.env.NODE_ENV === undefined ? console.log : false,
  logQueryParameters: true,
  models: [Author, Book],
  noTypeValidation: true,
  url: config.get<string>("pgUrl"),
})
