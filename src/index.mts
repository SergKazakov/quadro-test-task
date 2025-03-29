import { server } from "./server.mts"

server.listen(process.env.PORT, () =>
  console.log(`Listening on ${process.env.PORT}`),
)
