import { database } from "../config";

export async function removeTodo({ id }: { id: string }) {
  try {
    const result = await database.query(`DELETE FROM todos WHERE id = ?`, [id]);
    if (result.rowCount === 0) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted todo with id ${id}`,
        },
      ],
    };
  } catch (error) {
    throw error;
  }
}
