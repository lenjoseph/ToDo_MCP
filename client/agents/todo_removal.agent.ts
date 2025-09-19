import z from "zod";
import { Prompts } from "../prompts";

export const toDoRemovalAgentConfig = {
  name: "ToDo Item Remover",
  instructions: Prompts.todoItemRemover,
  handoffDescription: "A specialist in removing a specific todo item by id.",
  model: "gpt-4o-mini",
  outputType: z.object({
    id: z.string(),
    removed: z.boolean(),
  }),
};
