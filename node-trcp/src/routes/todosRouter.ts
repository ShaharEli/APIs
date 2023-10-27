import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { IDatabase } from "../types";

let database = [] as IDatabase;
let idsCounter = 1;

const todoValidation = z.object({
  task: z.string(),
  completed: z.boolean(),
});

const todosRouter = router({
  todos: publicProcedure.query(() => database),
  todo: publicProcedure.input(z.number()).query(({ input }) => {
    const todo = database.find((todo) => todo.id === input);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return todo;
  }),
  addTodo: publicProcedure.input(todoValidation).mutation(({ input }) => {
    database = [...database, { ...input, id: idsCounter++ }];
    return database[database.length - 1];
  }),
  addTodos: publicProcedure
    .input(z.array(todoValidation))
    .mutation(({ input }) => {
      database = [
        ...database,
        ...input.map((todo) => ({ ...todo, id: idsCounter++ })),
      ];
      return database;
    }),
  updateTodo: publicProcedure
    .input(todoValidation.merge(z.object({ id: z.string() })))
    .mutation(({ input }) => {
      const todoId = parseInt(input.id);
      const todoIndex = database.findIndex((todo) => todo.id === todoId);
      if (todoIndex === -1) {
        throw new Error("Todo not found");
      }
      database[todoIndex] = { ...input, id: todoId };
      return database[todoIndex];
    }),

  deleteTodo: publicProcedure.input(z.number()).mutation(({ input }) => {
    const todoIndex = database.findIndex((todo) => todo.id === input);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }
    database.splice(todoIndex, 1);
    return true;
  }),
  deleteTodos: publicProcedure.mutation(() => {
    database = [] as IDatabase;
    return true;
  }),
});
export default todosRouter;
