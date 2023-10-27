import app from "./app";
import { PORT } from "./utils";

app.listen(process.env.PORT ? Number(process.env.PORT) : PORT);
