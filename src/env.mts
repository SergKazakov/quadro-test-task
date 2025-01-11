import { cleanEnv, port, url } from "envalid"

export const env = cleanEnv(process.env, {
  DATABASE_URL: url(),
  PORT: port({ default: 4444 }),
})
