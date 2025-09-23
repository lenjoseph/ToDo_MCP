import { RunContext, tool } from "@openai/agents";
import z from "zod";
import { IPriorityRankingCriteria } from "../constants";

export const fetchPriorityRankingCriteria = tool({
  name: "fetch_priority_ranking_tool",
  description: "Return the priority ranking configuration.",
  parameters: z.object({}),
  execute: (_args, runContext?: RunContext) => {
    const context = runContext?.context as
      | Partial<IPriorityRankingCriteria>
      | undefined;
    return `The priority ranking criteria for high priority are 
    ${context?.priorityRankingCriteria.high}, and for medium priority are 
    ${context?.priorityRankingCriteria.medium}`;
  },
});
