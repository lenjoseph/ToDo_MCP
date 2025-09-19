import { RunContext, tool } from "@openai/agents";
import z from "zod";

interface IPriorityRankingCriteria {
  high: string[];
  medium: string[];
}

export const fetchPriorityRankingCriteria = tool({
  name: "fetch_priority_ranking_tool",
  description: "Return the priority ranking configuration.",
  parameters: z.object({}),
  execute: (_args, runContext?: RunContext<IPriorityRankingCriteria>) => {
    return `The priority ranking criteria for high priority is 
    ${runContext.context.high}, and for medium priority is 
    ${runContext.context.medium}`;
  },
});
