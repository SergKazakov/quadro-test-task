import config from "config"

import { server } from "./server.mjs"

server.listen(config.get("port"), () =>
  console.log(`Listening on ${server.address().port}`),
)
