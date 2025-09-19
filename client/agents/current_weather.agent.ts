import z from "zod";
import { Prompts } from "../prompts";

export const currentWeatherAgentConfig = {
  name: "Current Weather Agent",
  instructions: Prompts.currentWeather,
  handoffDescription: "A specialist in checking current weather conditions.",
  outputType: z.object({
    conditionsOptimal: z.boolean(),
    location: z.string(),
    toDoItem: z.string(),
    recommendation: z.string(),
  }),
  model: "gpt-4o-mini",
};
