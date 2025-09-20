import { Agent } from "@openai/agents";
import { Prompts } from "../prompts";

const weatherConditionsEstimator = new Agent({
  name: "weather_conditions_estimator_agent",
  instructions: Prompts.optimalConditions,
});

export const weatherConditionsTool = weatherConditionsEstimator.asTool({
  toolName: "weather_conditions_estimation",
  toolDescription: `Estimates the optimal weather conditions to execute the supplied 
    to-do item task.`,
});
