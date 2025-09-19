import { Agent, InputGuardrail, run } from "@openai/agents";
import z from "zod";
import { PermittedCategories } from "../constants/permitted_categories";

const toDoGuardRailAgent = new Agent({
  name: "To-Do Guardrail Agent",
  instructions: `You check if both of these are true: the intent is to create a new to do item, 
  the submitted todo item does not pertain to one of the permitted categories: ${PermittedCategories}. If both are true,
  you return isPermitted as false and explain reasoning. Otherwise, always set isPermitted to true.`,
  outputType: z.object({
    isPermitted: z.boolean(),
    reasoning: z.string(),
  }),
});

export const toDoGuardRail: InputGuardrail = {
  name: "To-Do Guardrail",
  execute: async ({ input, context }) => {
    const result = await run(toDoGuardRailAgent, input, { context });
    if (!result.finalOutput) {
      throw new Error("Agent run failed to produce output");
    }
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput.isPermitted === false,
    };
  },
};
