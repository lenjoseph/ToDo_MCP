import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { migrate } from "./db/migrate";
import { createTodo } from "./db/tools/create";
import { listTodos } from "./db/tools/list";
import { removeTodo } from "./db/tools/remove";
import { updateTodo } from "./db/tools/update";
import { getCurrentWeather } from "./util/utils";

// Initialize database on startup
async function initializeDatabase() {
  await migrate();
}

const server = new McpServer({
  name: "Todo List Server",
  version: "1.0.0",
});

// Define the enums based on your schema requirements
const ToDoStatus = ["Incomplete", "In Progress", "Complete"] as const;
const ToDoCategory = [
  "Customer Acquisition",
  "Operational Efficiency",
  "Product Manufacturing",
  "System Management",
  "Financial Optimization",
  "Product Servicing & Repairs",
] as const;
const PriorityRating = ["Low", "Medium", "High"] as const;

// Create Zod schemas for the enums
const ZodToDoStatus = z.enum(ToDoStatus);
const ZodToDoCategory = z.enum(ToDoCategory);
const ZodPriorityRating = z.enum(PriorityRating);

server.registerTool(
  "check_weather_conditions",
  {
    title: "Check Weather Conditions",
    description: "Checks the current weather conditions for a given location",
    inputSchema: { location: z.string() },
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
    inputSchema: {
      title: z.string(),
      category: ZodToDoCategory,
      priorityRating: ZodPriorityRating,
      optimalWeatherConditions: z.string(),
    },
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
    inputSchema: {
      id: z.string().uuid(),
      title: z.string().optional().nullable(),
      status: ZodToDoStatus.optional().nullable(),
      category: ZodToDoCategory.optional().nullable(),
      priorityRating: ZodPriorityRating.optional().nullable(),
      optimalWeatherConditions: z.string().optional().nullable(),
    },
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
  "list_todos",
  {
    title: "List ToDo Items",
    description: "Lists all to-do items",
    inputSchema: {},
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
    inputSchema: {
      id: z.string().uuid(),
    },
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
