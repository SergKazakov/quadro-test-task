import { env } from "./env.mts"
import { server } from "./server.mts"

server.listen(env.PORT, () => console.log(`Listening on ${env.PORT}`))
