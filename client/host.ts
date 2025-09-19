import {
  Agent,
  InputGuardrailTripwireTriggered,
  MCPServerStdio,
  run,
} from "@openai/agents";
import * as dotenv from "dotenv";
import * as path from "node:path";
import {
  currentWeatherAgentConfig,
  todoCreatorAgentConfig,
  toDoListerAgentConfig,
  toDoRemovalAgentConfig,
  toDoUpaterAgentConfig,
} from "./agents";
import { PermittedCategories } from "./constants/permitted_categories";
import { PriorityRankingCriteria } from "./constants/priority_ranking_criteria";
import { toDoGuardRail } from "./guardrails/todo_input.guardrail";
import { Prompts } from "./prompts";
import { extractId } from "./util";

dotenv.config();

async function ToDoDemo() {
  console.log("Initializing host and connecting to MCP server...");
  const mcpServer = new MCPServerStdio({
    name: "ToDo MCP Server",
    fullCommand: `npx ts-node ${path.resolve(__dirname, "../mcp/server.ts")}`,
  });

  await mcpServer
    .connect()
    .then(() => {
      console.log("Connected to MCP Server...");
    })
    .catch((e) => console.error(e));

  try {
    // check if current weather conditions are ideal for performing the supplied task using mcpServer util
    const MCPCurrentWeatherAgent = Agent.create({
      ...currentWeatherAgentConfig,
      mcpServers: [mcpServer],
    });

    const MCPToDoCreatorAgent = Agent.create({
      ...todoCreatorAgentConfig,
      mcpServers: [mcpServer],
    });

    const MCPTodoUpdaterAgent = Agent.create({
      ...toDoUpaterAgentConfig,
      mcpServers: [mcpServer],
    });

    const MCPToDoListerAgent = Agent.create({
      ...toDoListerAgentConfig,
      mcpServers: [mcpServer],
    });

    const MCPToDoRemovalAgent = Agent.create({
      ...toDoRemovalAgentConfig,
      mcpServers: [mcpServer],
    });

    // orchestrating agent
    const ToDoOrchestratorAgent = Agent.create({
      name: "To-Do Item Orchestrator Agent",
      instructions: Prompts.orchestrator,
      handoffs: [
        MCPCurrentWeatherAgent,
        MCPToDoCreatorAgent,
        MCPToDoListerAgent,
        MCPTodoUpdaterAgent,
        MCPToDoRemovalAgent,
      ],
      inputGuardrails: [toDoGuardRail],
      model: "gpt-4o-mini",
    });

    const weatherResult = await run(
      ToDoOrchestratorAgent,
      "Are current weather conditions optimal for walking the dog in New York, New York?"
    );
    console.log("WEATHER RESULT");
    console.log(weatherResult.finalOutput);

    const createResultOne = await run(
      ToDoOrchestratorAgent,
      "Add a new todo item for performing routine intercom maintenance.",
      {
        context: {
          priorityRankingCriteria: PriorityRankingCriteria,
          permittedCategories: PermittedCategories,
        },
      }
    );
    console.log("CREATE TODO OUTPUT");
    console.log(createResultOne.finalOutput);

    const createdTodoId = extractId(createResultOne.finalOutput as unknown);

    // update the record that was created
    const updateResult = await run(
      ToDoOrchestratorAgent,
      `Update the status for the todo with id ${createdTodoId} to Complete.`
    );
    console.log("UPDATE RESULT OUTPUT");
    console.log(updateResult.finalOutput);

    // list todo items

    const listResult = await run(
      ToDoOrchestratorAgent,
      "List the current todo items."
    );
    console.log("LIST RESULT OUTPUT");
    console.log(listResult.finalOutput);

    // remove todo item
    const removeResult = await run(
      ToDoOrchestratorAgent,
      `Remove the todo item with id ${createdTodoId}.`
    );
    console.log("REMOVE RESULT OUTPUT");
    console.log(removeResult.finalOutput);

    // try to create illigitimate to-do item, blocked by guardrail
    const createResultTwo = await run(
      ToDoOrchestratorAgent,
      "Add a new todo item for getting the car washed.",
      {
        context: {
          priorityRankingCriteria: PriorityRankingCriteria,
          permittedCategories: PermittedCategories,
        },
      }
    );

    console.log(createResultTwo.finalOutput);
  } catch (e) {
    if (e instanceof InputGuardrailTripwireTriggered) {
      console.log(`Guardrail tripwire triggered: ${e}`);
    } else {
      console.log(`Error processing request: ${JSON.stringify(e)}`);
    }
  } finally {
    await mcpServer.close();
  }
}

ToDoDemo();
