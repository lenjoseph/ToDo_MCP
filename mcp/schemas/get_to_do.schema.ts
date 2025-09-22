import z from "zod";

export const GetToDoSchema = {
  id: z.string().uuid(),
};
