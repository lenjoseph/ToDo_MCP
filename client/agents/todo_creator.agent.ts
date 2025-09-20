import z from "zod";
import { fetchPermittedCategories } from "../context/permitted_categories.context";
import { Prompts } from "../prompts";
import { priorityRatingTool } from "./priority_rating.agent";
import { weatherConditionsTool } from "./weather_conditions_estimator.agent";

// needs to use paralell agents in order to facilitate two creation processes
export const todoCreatorAgentConfig = {
  name: "Todo Item Creator",
  instructions: Prompts.todoItemCreator,
  handoffDescription: "A specialist in creating todo items",

  //@ts-ignore
  tools: [priorityRatingTool, fetchPermittedCategories, weatherConditionsTool],
  outputType: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    category: z.string(),
    priorityRating: z.string(),
    optimalWeatherConditions: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  model: "gpt-4.1",
};
