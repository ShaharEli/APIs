import cors from "cors";
import express from "express";
import morgan from "morgan";
import todosRouter from "./routes/todosRouter";
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/todos", todosRouter);

export default app;
