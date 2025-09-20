import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";
import { fetchPermittedCategories } from "../context";
import { priorityRatingTool, weatherConditionsTool } from "../tools";

// needs to use paralell agents in order to facilitate two creation processes
export const todoCreatorAgentConfig = {
  name: AgentConfig.todoItemCreator.name,
  instructions: AgentConfig.todoItemCreator.prompt,
  handoffDescription: AgentConfig.todoItemCreator.handoffDescription,

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
  model: LLMModels.default,
};
