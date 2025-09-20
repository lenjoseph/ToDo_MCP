import { Agent } from "@openai/agents";
import { AgentConfig } from "../agent_config";

const weatherConditionsEstimator = new Agent({
  name: AgentConfig.optimalConditions.name,
  instructions: AgentConfig.optimalConditions.prompt,
});

export const weatherConditionsTool = weatherConditionsEstimator.asTool({
  toolName: "weather_conditions_estimation_tool",
  toolDescription: `Estimates the optimal weather conditions to execute the supplied 
    to-do item task.`,
});
