import { Agent } from "@openai/agents";
import z from "zod";
import { fetchPriorityRankingCriteria } from "../context/priority_ranking_criteria.context";
import { Prompts } from "../prompts";

const priorityRatingAgent = new Agent({
  name: "Priority Rating Agent",
  instructions: Prompts.priorityRating,
  outputType: z.object({
    priorityRating: z.enum(["high", "medium", "low"]),
  }),
  tools: [fetchPriorityRankingCriteria],
  model: "gpt-4o-mini",
});

export const priorityRatingTool = priorityRatingAgent.asTool({
  toolName: "Priority Rating Tool",
  toolDescription:
    "This tool allows for the rating of a todo item's priority category.",
});
