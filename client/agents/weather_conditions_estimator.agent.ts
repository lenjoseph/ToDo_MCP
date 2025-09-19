import { Agent } from "@openai/agents";
import { Prompts } from "../prompts";

const weatherConditionsEstimator = new Agent({
  name: "weather_conditions_estimator_agent",
  instructions: Prompts.optimalConditions,
});

export const weatherConditionsTool = weatherConditionsEstimator.asTool({
  toolName: "weather_conditions_estimation",
  toolDescription: `Estimate the optimal weather conditions to execute a supplied 
    to-do item task.`,
});
