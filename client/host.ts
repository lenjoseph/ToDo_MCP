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
  orchestratorAgentConfig,
  todoCreatorAgentConfig,
  toDoGetterAgentConfig,
  toDoListerAgentConfig,
  toDoRemovalAgentConfig,
  toDoUpaterAgentConfig,
} from "./agents";
import { PermittedCategories, PriorityRankingCriteria } from "./constants";
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
    const MCPCurrentWeatherAgent = Agent.create({
      ...currentWeatherAgentConfig,
      name: currentWeatherAgentConfig.name!,
      mcpServers: [mcpServer],
    });

    const MCPToDoCreatorAgent = Agent.create({
      ...todoCreatorAgentConfig,
      name: todoCreatorAgentConfig.name!,
      mcpServers: [mcpServer],
    });

    const MCPToDoGetterAgent = Agent.create({
      ...toDoGetterAgentConfig,
      name: toDoGetterAgentConfig.name!,
      mcpServers: [mcpServer],
    });

    const MCPTodoUpdaterAgent = Agent.create({
      ...toDoUpaterAgentConfig,
      name: toDoUpaterAgentConfig.name!,
      mcpServers: [mcpServer],
    });

    const MCPToDoListerAgent = Agent.create({
      ...toDoListerAgentConfig,
      name: toDoListerAgentConfig.name!,
      mcpServers: [mcpServer],
    });

    const MCPToDoRemovalAgent = Agent.create({
      ...toDoRemovalAgentConfig,
      name: toDoRemovalAgentConfig.name!,
      mcpServers: [mcpServer],
    });

    // orchestrating agent
    const OrchestratorAgent = Agent.create({
      ...orchestratorAgentConfig,
      name: orchestratorAgentConfig.name!,
      handoffs: [
        MCPCurrentWeatherAgent,
        MCPToDoCreatorAgent,
        MCPToDoListerAgent,
        MCPToDoGetterAgent,
        MCPTodoUpdaterAgent,
        MCPToDoRemovalAgent,
      ],
    });

    // Check if weather conditions are suitable for a given todo item
    const weatherResult = await withPeriodicLogging(
      run(
        OrchestratorAgent,
        "Are current weather conditions optimal for walking the dog in New York, New York?"
      ),
      "Checking weather conditions..."
    );
    console.log("WEATHER RESULT");
    console.log(weatherResult.finalOutput);

    // Create a new todo item
    const createResultOne = await withPeriodicLogging(
      run(
        OrchestratorAgent,
        "Add a new todo item for performing routine building exterior intercom maintenance.",
        {
          context: {
            PriorityRankingCriteria,
            PermittedCategories,
          },
        }
      ),
      "Creating todo item..."
    );
    console.log("CREATE TODO OUTPUT");
    console.log(createResultOne.finalOutput);

    const createdTodoId = extractId(createResultOne.finalOutput as unknown);

    // get the created todo item by id
    const getResult = await withPeriodicLogging(
      run(OrchestratorAgent, `Get the todo item with id ${createdTodoId}.`),
      "Getting todo item..."
    );
    console.log("GET RESULT OUTPUT");
    console.log(getResult.finalOutput);

    // Update the created todo item
    const updateResult = await withPeriodicLogging(
      run(
        OrchestratorAgent,
        `Update the status for the todo item with id ${createdTodoId} to Complete.`
      ),
      "Updating todo item..."
    );
    console.log("UPDATE RESULT OUTPUT");
    console.log(updateResult.finalOutput);

    // Retrieve and display all current todo items
    const listResult = await withPeriodicLogging(
      run(OrchestratorAgent, "List the current todo items."),
      "Listing todo items..."
    );
    console.log("LIST RESULT OUTPUT");
    console.log(listResult.finalOutput);

    // Delete the previously created todo item
    const removeResult = await withPeriodicLogging(
      run(OrchestratorAgent, `Remove the todo item with id ${createdTodoId}.`),
      "Removing todo item..."
    );
    console.log("REMOVE RESULT OUTPUT");
    console.log(removeResult.finalOutput);

    // Verify todo list after deletion
    const listResultTwo = await withPeriodicLogging(
      run(OrchestratorAgent, "List the current todo items."),
      "Listing todo items..."
    );
    console.log("LIST RESULT OUTPUT - POST DELETION");
    console.log(listResultTwo.finalOutput);

    // Attempt to create invalid todo item to test guardrail protection
    const createResultTwo = await withPeriodicLogging(
      run(
        OrchestratorAgent,
        "Add a new todo item for getting the car washed.",
        {
          context: {
            PriorityRankingCriteria,
            PermittedCategories,
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
