import { expect, it } from "vitest"

import { postAuthor } from "../testUtils/index.mts"

it("should create author", async () => {
  await expect(postAuthor()).resolves.toMatchObject({
    data: { id: expect.any(String) },
    status: 201,
  })
})
