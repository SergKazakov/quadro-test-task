import config from "config"

import { server } from "./server.mts"

server.listen(config.get<number>("port"), () =>
  console.log(`Listening on ${config.get<number>("port")}`),
)
