import {
  Agent,
  InputGuardrailTripwireTriggered,
  MCPServerStdio,
  run,
} from "@openai/agents";
import * as dotenv from "dotenv";
import * as path from "node:path";
import { AgentConfig } from "./agent_config";
import {
  currentWeatherAgentConfig,
  todoCreatorAgentConfig,
  toDoListerAgentConfig,
  toDoRemovalAgentConfig,
  toDoUpaterAgentConfig,
} from "./agents";
import {
  LLMModels,
  PermittedCategories,
  PriorityRankingCriteria,
} from "./constants";
import { toDoGuardRail } from "./guardrails";
import { extractId, withPeriodicLogging } from "./util";

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
      name: AgentConfig.orchestrator.name,
      instructions: AgentConfig.orchestrator.prompt,
      handoffs: [
        MCPCurrentWeatherAgent,
        MCPToDoCreatorAgent,
        MCPToDoListerAgent,
        MCPTodoUpdaterAgent,
        MCPToDoRemovalAgent,
      ],
      inputGuardrails: [toDoGuardRail],
      model: LLMModels.gpt4oMini,
    });

    // Check if weather conditions are suitable for a given todo item
    const weatherResult = await withPeriodicLogging(
      run(
        ToDoOrchestratorAgent,
        "Are current weather conditions optimal for walking the dog in New York, New York?"
      ),
      "Checking weather conditions..."
    );
    console.log("WEATHER RESULT");
    console.log(weatherResult.finalOutput);

    // Create a new todo item
    const createResultOne = await withPeriodicLogging(
      run(
        ToDoOrchestratorAgent,
        "Add a new todo item for performing routine building exterior intercom maintenance.",
        {
          context: {
            priorityRankingCriteria: PriorityRankingCriteria,
            permittedCategories: PermittedCategories,
          },
        }
      ),
      "Creating todo item..."
    );
    console.log("CREATE TODO OUTPUT");
    console.log(createResultOne.finalOutput);

    const createdTodoId = extractId(createResultOne.finalOutput as unknown);

    // Update the created todo item
    const updateResult = await withPeriodicLogging(
      run(
        ToDoOrchestratorAgent,
        `Update the status for the todo with id ${createdTodoId} to Complete.`
      ),
      "Updating todo item..."
    );
    console.log("UPDATE RESULT OUTPUT");
    console.log(updateResult.finalOutput);

    // Retrieve and display all current todo items
    const listResult = await withPeriodicLogging(
      run(ToDoOrchestratorAgent, "List the current todo items."),
      "Listing todo items..."
    );
    console.log("LIST RESULT OUTPUT");
    console.log(listResult.finalOutput);

    // Delete the previously created todo item
    const removeResult = await withPeriodicLogging(
      run(
        ToDoOrchestratorAgent,
        `Remove the todo item with id ${createdTodoId}.`
      ),
      "Removing todo item..."
    );
    console.log("REMOVE RESULT OUTPUT");
    console.log(removeResult.finalOutput);

    // Verify todo list after deletion
    const listResultTwo = await withPeriodicLogging(
      run(ToDoOrchestratorAgent, "List the current todo items."),
      "Listing todo items..."
    );
    console.log("LIST RESULT OUTPUT - POST DELETION");
    console.log(listResultTwo.finalOutput);

    // Attempt to create invalid todo item to test guardrail protection
    const createResultTwo = await withPeriodicLogging(
      run(
        ToDoOrchestratorAgent,
        "Add a new todo item for getting the car washed.",
        {
          context: {
            priorityRankingCriteria: PriorityRankingCriteria,
            permittedCategories: PermittedCategories,
          },
        }
      ),
      "Creating todo item..."
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
