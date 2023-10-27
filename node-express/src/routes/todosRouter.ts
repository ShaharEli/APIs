import { Router } from "express";
import { IDatabase } from "../types";

const todosRouter = Router();

let database = [] as IDatabase;
let idsCounter = 1;

todosRouter.get("/", (req, res) => {
  return res.json(database);
});

todosRouter.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const todoId = parseInt(id);
    const todo = database.find((todo) => todo.id === todoId);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.json(todo);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});
todosRouter.post("/", (req, res) => {
  try {
    let newTodos = [] as IDatabase;
    if (!Array.isArray(req.body)) {
      newTodos = [req.body];
    } else {
      newTodos = req.body;
    }
    newTodos.forEach((todo) => {
      if (!todo.task || todo.completed === undefined) {
        return res.status(400).json({ error: "Missing task or completed" });
      }
    });
    database = [
      ...database,
      ...newTodos.map((todo) => ({ ...todo, id: idsCounter++ })),
    ];
    if (newTodos.length === 1) {
      return res.json(database[database.length - 1]);
    } else {
      return res.json(database);
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

todosRouter.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    if (!req.body.task || req.body.completed === undefined || !req.body.id) {
      return res.status(400).json({ error: "Missing task or completed" });
    }
    const todoId = parseInt(id);
    const todoIndex = database.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }
    database[todoIndex] = { ...req.body };
    return res.json(database[todoIndex]);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

todosRouter.delete("/", (req, res) => {
  database = [];
  return res.json(database);
});

todosRouter.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const todoId = parseInt(id);
    const todoIndex = database.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }
    database.splice(todoIndex, 1);
    return res.json(database);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default todosRouter;
