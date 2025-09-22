import z from "zod";

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

const ZodToDoStatus = z.enum(ToDoStatus);
const ZodToDoCategory = z.enum(ToDoCategory);
const ZodPriorityRating = z.enum(PriorityRating);

export const UpdateToDoSchema = {
  id: z.string().uuid(),
  title: z.string().optional().nullable(),
  status: ZodToDoStatus.optional().nullable(),
  category: ZodToDoCategory.optional().nullable(),
  priorityRating: ZodPriorityRating.optional().nullable(),
  optimalWeatherConditions: z.string().optional().nullable(),
};
