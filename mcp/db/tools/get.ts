import { database } from "../config";

export async function getToDo({ id }: { id: string }) {
  const result = await database.get(`SELECT * FROM todos WHERE id = ?`, [id]);

  if (!result) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ error: "Todo not found" }),
        },
      ],
    };
  }

  const mappedTodo = {
    id: result.id,
    title: result.title,
    status: result.status,
    category: result.category,
    priorityRating: result.priority_rating,
    optimalWeatherConditions: result.optimal_weather_conditions,
    created_at: result.created_at,
    updated_at: result.updated_at,
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ todo: mappedTodo }),
      },
    ],
  };
}
