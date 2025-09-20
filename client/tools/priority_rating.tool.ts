import { Agent } from "@openai/agents";
import z from "zod";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";
import { fetchPriorityRankingCriteria } from "../context";

const priorityRatingAgent = new Agent({
  name: AgentConfig.priorityRating.name,
  instructions: AgentConfig.priorityRating.prompt,
  outputType: z.object({
    priorityRating: z.enum(["high", "medium", "low"]),
  }),
  tools: [fetchPriorityRankingCriteria],
  model: LLMModels.gpt4oMini,
});

export const priorityRatingTool = priorityRatingAgent.asTool({
  toolName: "priority_rating_tool",
  toolDescription:
    "This tool allows for the rating of a todo item's priority category.",
});
