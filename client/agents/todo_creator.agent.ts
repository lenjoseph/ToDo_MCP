import z from "zod";
import { Prompts } from "../prompts";
import { weatherConditionsTool } from "./weather_conditions_estimator.agent";

// needs to use paralell agents in order to facilitate two creation processes
export const todoCreatorAgentConfig = {
  name: "Todo Item Creator",
  instructions: Prompts.todoItemCreator,
  handoffDescription: "A specialist in creating todo items",

  //@ts-ignore
  tools: [
    // priorityRatingTool,
    // fetchPermittedCategories,
    weatherConditionsTool,
  ],
  outputType: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    category: z.string(),
    priorityRating: z.string(),
    optimalWeatherConditions: z.string().optional().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  model: "gpt-4.1",
};
