import todosRouter from "./routes/todosRouter";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const server = createHTTPServer({
  router: todosRouter,
});

export default server;
