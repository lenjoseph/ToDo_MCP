import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { randomUUID } from "crypto";
import z from "zod";
import { database } from "./db/config";
import { migrate } from "./db/migrate";
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
      optimalWeatherConditions: z.string().optional().nullable(),
    },
  },
  async ({ title, category, priorityRating, optimalWeatherConditions }) => {
    const id = randomUUID();

    await database.query(
      `INSERT INTO todos (id, title, category, priority_rating, optimal_weather_conditions, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'Incomplete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [id, title, category, priorityRating, optimalWeatherConditions]
    );

    // Get the inserted record
    const insertedRecord = await database.get(
      `SELECT * FROM todos WHERE id = ?`,
      [id]
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(insertedRecord),
        },
      ],
    };
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
    console.error("updating");
    const updates: string[] = [];
    const values: any[] = [id];

    const updateFields = {
      title,
      status,
      category,
      priority_rating: priorityRating, // Matches DB column name
      optimal_weather_conditions: optimalWeatherConditions,
    };

    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    console.error("updates", updates);
    const sqlQuery = `UPDATE todos 
       SET ${updates.join(", ")}
       WHERE id = ?`;

    const result = await database.query(sqlQuery, values);

    if (result.rowCount === 0) {
      throw new Error(`Todo with id ${id} not found`);
    }

    // Get the updated record
    const updatedRecord = await database.get(
      `SELECT * FROM todos WHERE id = ?`,
      [id]
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(updatedRecord),
        },
      ],
    };
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
    const result = await database.all(
      `SELECT * FROM todos ORDER BY created_at DESC`
    );
    const mappedTodos = result.map((todo: any) => ({
      id: todo.id,
      title: todo.title,
      status: todo.status,
      category: todo.category,
      priorityRating: todo.priority_rating,
      optimalWeatherConditions: todo.optimal_weather_conditions,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ todos: mappedTodos }),
        },
      ],
    };
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
    try {
      const result = await database.query(`DELETE FROM todos WHERE id = ?`, [
        id,
      ]);
      if (result.rowCount === 0) {
        throw new Error(`Todo with id ${id} not found`);
      }

      return {
        content: [
          {
            type: "text",
            text: `Successfully deleted todo with id ${id}`,
          },
        ],
      };
    } catch (error) {
      console.error(error);
    }
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
