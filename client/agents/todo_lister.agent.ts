import z from "zod";
import { Prompts } from "../prompts";

export const toDoListerAgentConfig = {
  name: "ToDo Item Lister",
  instructions: Prompts.todoItemLister,
  handoffDescription: "A specialist in listing current todo items.",
  model: "gpt-4o-mini",
  outputType: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        status: z.string(),
        category: z.string(),
        priorityRating: z.string(),
        optimalWeatherConditions: z.string().optional().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
    ),
  }),
};
