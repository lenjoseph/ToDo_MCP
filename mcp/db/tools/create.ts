import { randomUUID } from "crypto";
import { database } from "../config";

export async function createTodo({
  title,
  category,
  priorityRating,
  optimalWeatherConditions,
}: {
  title: string;
  category: string;
  priorityRating: string;
  optimalWeatherConditions?: string | null;
}) {
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
        type: "text" as const,
        text: JSON.stringify(insertedRecord),
      },
    ],
  };
}
