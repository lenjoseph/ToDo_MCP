import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { migrate } from "./db/migrate";
import {
  createTodo,
  getToDo,
  listTodos,
  removeTodo,
  updateTodo,
} from "./db/tools";
import {
  CreateToDoSchema,
  CurrentWeatherSchema,
  GetToDoSchema,
  RemoveToDoSchema,
  UpdateToDoSchema,
} from "./schemas";
import { getCurrentWeather } from "./utils";

// Initialize database on startup
async function initializeDatabase() {
  await migrate();
}

const server = new McpServer({
  name: "Todo List Server",
  version: "1.0.0",
});

server.registerTool(
  "check_weather_conditions",
  {
    title: "Check Weather Conditions",
    description: "Checks the current weather conditions for a given location",
    inputSchema: CurrentWeatherSchema,
  },
  async ({ location }) => {
    if (!location) {
      throw new Error("No location provided");
    }
    const currentWeathConditions = await getCurrentWeather(location);
    return {
      content: [
        {
          type: "text",
          text: currentWeathConditions,
        },
      ],
    };
  }
);

server.registerTool(
  "create_todo",
  {
    title: "Create ToDo Item",
    description: "Creates a new to-do item",
    inputSchema: CreateToDoSchema,
  },
  async ({ title, category, priorityRating, optimalWeatherConditions }) => {
    return await createTodo({
      title,
      category,
      priorityRating,
      optimalWeatherConditions,
    });
  }
);

server.registerTool(
  "update_todo",
  {
    title: "Update ToDo Item",
    description: "Updates an existing to-do item by id",
    inputSchema: UpdateToDoSchema,
  },
  async ({
    id,
    title,
    status,
    category,
    priorityRating,
    optimalWeatherConditions,
  }) => {
    return await updateTodo({
      id,
      title,
      status,
      category,
      priorityRating,
      optimalWeatherConditions,
    });
  }
);

server.registerTool(
  "get_todo",
  {
    title: "Get ToDo Item By Id",
    description: "Gets a single todo item by id",
    inputSchema: GetToDoSchema,
  },
  async ({ id }) => {
    return await getToDo({ id });
  }
);

server.registerTool(
  "list_todos",
  {
    title: "List ToDo Items",
    description: "Lists all to-do items",
  },
  async () => {
    return await listTodos();
  }
);

server.registerTool(
  "remove_todo",
  {
    title: "Remove ToDo Item",
    description: "Removes a to-do item by id",
    inputSchema: RemoveToDoSchema,
  },
  async ({ id }) => {
    return await removeTodo({ id });
  }
);

async function startServer() {
  await initializeDatabase();
  const transport = new StdioServerTransport();
  server.connect(transport);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
