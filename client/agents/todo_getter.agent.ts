import { AgentConfiguration } from "@openai/agents";
import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";

export const toDoGetterAgentConfig: Partial<
  AgentConfiguration<
    unknown,
    z.ZodObject<{
      id: z.ZodString;
      title: z.ZodString;
      status: z.ZodString;
      category: z.ZodString;
      priorityRating: z.ZodString;
      optimalWeatherConditions: z.ZodString;
    }>
  >
> = {
  name: AgentConfig.todoItemGetter.name,
  instructions: AgentConfig.todoItemGetter.prompt,
  handoffDescription: AgentConfig.todoItemGetter.handoffDescription,
  model: LLMModels.gpt4oMini,
  modelSettings: { temperature: 0.1 },
  outputType: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    category: z.string(),
    priorityRating: z.string(),
    optimalWeatherConditions: z.string(),
  }),
};
