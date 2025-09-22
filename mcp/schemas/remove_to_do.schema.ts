import z from "zod";

export const RemoveToDoSchema = {
  id: z.string().uuid(),
};
