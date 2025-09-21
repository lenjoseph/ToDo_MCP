import { AgentConfiguration } from "@openai/agents";
import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";

export const toDoListerAgentConfig: Partial<
  AgentConfiguration<
    unknown,
    z.ZodObject<{
      items: z.ZodArray<
        z.ZodObject<{
          id: z.ZodString;
          title: z.ZodString;
          status: z.ZodString;
          category: z.ZodString;
          priorityRating: z.ZodString;
          optimalWeatherConditions: z.ZodString;
          createdAt: z.ZodString;
          updatedAt: z.ZodString;
        }>
      >;
    }>
  >
> = {
  name: AgentConfig.todoItemLister.name,
  instructions: AgentConfig.todoItemLister.prompt,
  handoffDescription: AgentConfig.todoItemLister.handoffDescription,
  model: LLMModels.gpt4oMini,
  modelSettings: { temperature: 0.1 },
  outputType: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        status: z.string(),
        category: z.string(),
        priorityRating: z.string(),
        optimalWeatherConditions: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
    ),
  }),
};
