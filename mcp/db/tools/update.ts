import { database } from "../config";

export async function updateTodo({
  id,
  title,
  status,
  category,
  priorityRating,
  optimalWeatherConditions,
}: {
  id: string;
  title?: string | null;
  status?: string | null;
  category?: string | null;
  priorityRating?: string | null;
  optimalWeatherConditions?: string | null;
}) {
  const updates: string[] = [];
  const values: any[] = [];

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
  const sqlQuery = `UPDATE todos 
     SET ${updates.join(", ")}
     WHERE id = ?`;

  const result = await database.query(sqlQuery, [...values, id]);

  if (result.rowCount === 0) {
    throw new Error(`Todo with id ${id} not found`);
  }

  // Get the updated record
  const updatedRecord = await database.get(`SELECT * FROM todos WHERE id = ?`, [
    id,
  ]);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(updatedRecord),
      },
    ],
  };
}
