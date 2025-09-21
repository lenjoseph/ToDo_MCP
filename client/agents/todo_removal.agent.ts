import { AgentConfiguration } from "@openai/agents";
import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";

export const toDoRemovalAgentConfig: Partial<
  AgentConfiguration<
    unknown,
    z.ZodObject<{
      id: z.ZodString;
      removed: z.ZodBoolean;
    }>
  >
> = {
  name: AgentConfig.todoItemRemover.name,
  instructions: AgentConfig.todoItemRemover.prompt,
  handoffDescription: AgentConfig.todoItemRemover.handoffDescription,
  model: LLMModels.gpt4oMini,
  modelSettings: { temperature: 0.1 },
  outputType: z.object({
    id: z.string(),
    removed: z.boolean(),
  }),
};
