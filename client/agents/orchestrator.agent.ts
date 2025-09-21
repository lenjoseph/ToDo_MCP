import { AgentConfiguration } from "@openai/agents";
import { AgentConfig } from "../agent_config";
import { LLMModels } from "../constants";
import { toDoGuardRail } from "../guardrails";

export const orchestratorAgentConfig: Partial<AgentConfiguration> = {
  name: AgentConfig.orchestrator.name,
  instructions: AgentConfig.orchestrator.prompt,
  inputGuardrails: [toDoGuardRail],
  model: LLMModels.gpt4oMini,
};
