import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";

export const toDoUpaterAgentConfig = {
  name: AgentConfig.todoItemUpdater.name,
  instructions: AgentConfig.todoItemUpdater.prompt,
  handoffDescription: AgentConfig.todoItemUpdater.handoffDescription,
  outputType: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    category: z.string(),
    priorityRating: z.string(),
    optimalWeatherConditions: z.string().optional().nullable(),
  }),
  model: LLMModels.default,
};
