import z from "zod";

const ToDoCategory = [
  "Customer Acquisition",
  "Operational Efficiency",
  "Product Manufacturing",
  "System Management",
  "Financial Optimization",
  "Product Servicing & Repairs",
] as const;
const PriorityRating = ["Low", "Medium", "High"] as const;

const ZodToDoCategory = z.enum(ToDoCategory);
const ZodPriorityRating = z.enum(PriorityRating);

export const CreateToDoSchema = {
  title: z.string(),
  category: ZodToDoCategory,
  priorityRating: ZodPriorityRating,
  optimalWeatherConditions: z.string(),
};
