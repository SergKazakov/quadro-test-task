import axios, { type AxiosInstance } from "axios"

import { type authors, type books } from "../db.mts"

export let client: AxiosInstance

export const setupClient = (port: number) => {
  client = axios.create({
    baseURL: `http://127.0.0.1:${port}/api`,
    validateStatus: () => true,
  })
}

export const postAuthor = () =>
  client.post<typeof authors.$inferSelect>("/authors", {
    firstName: "foo",
    lastName: "foo",
  })

export const postBook = (data: unknown) =>
  client.post<typeof books.$inferSelect>("/books", data)

export const createBook = async () => {
  const { data: author } = await postAuthor()

  const { data } = await postBook({
    authorId: author.id,
    title: "foo",
    description: "foo",
  })

  return data
}

export const getBooks = (params?: Record<string, unknown>) =>
  client("/books", { params })

export const getBook = (id: string) => client(`/books/${id}`)

export const putBook = (id: string, data: unknown) =>
  client.put(`/books/${id}`, data)

export const deleteBook = (id: string) => client.delete(`/books/${id}`)
