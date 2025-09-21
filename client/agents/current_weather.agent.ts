import { AgentConfiguration } from "@openai/agents";
import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";

export const currentWeatherAgentConfig: Partial<
  AgentConfiguration<
    unknown,
    z.ZodObject<{
      conditionsOptimal: z.ZodBoolean;
      location: z.ZodString;
      toDoItem: z.ZodString;
      recommendation: z.ZodString;
    }>
  >
> = {
  name: AgentConfig.currentWeather.name,
  instructions: AgentConfig.currentWeather.prompt,
  handoffDescription: AgentConfig.currentWeather.handoffDescription,
  outputType: z.object({
    conditionsOptimal: z.boolean(),
    location: z.string(),
    toDoItem: z.string(),
    recommendation: z.string(),
  }),
  model: LLMModels.gpt4oMini,
  modelSettings: { temperature: 0.6 },
};
