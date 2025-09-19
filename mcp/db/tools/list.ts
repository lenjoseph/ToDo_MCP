import { database } from "../config";

export async function listTodos() {
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
        type: "text" as const,
        text: JSON.stringify({ todos: mappedTodos }),
      },
    ],
  };
}
