import { Agent, InputGuardrail, run } from "@openai/agents";
import z from "zod";
import { AgentConfig } from "../agent_config";

const toDoGuardRailAgent = new Agent({
  name: AgentConfig.toDoInputGuardrail.name,
  instructions: AgentConfig.toDoInputGuardrail.prompt,
  outputType: z.object({
    isPermitted: z.boolean(),
    reasoning: z.string().optional().nullable(),
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
