import z from "zod";
import { Prompts } from "../prompts";

export const toDoUpaterAgentConfig = {
  name: "Todo Item Updater",
  instructions: Prompts.todoItemUpdater,
  handoffDescription: "A specialist in updating a todo item by id",
  outputType: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    category: z.string(),
    priorityRating: z.string(),
    optimalWeatherConditions: z.string().optional().nullable(),
  }),
  model: "gpt-4.1",
};
