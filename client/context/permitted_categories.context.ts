import { RunContext, tool } from "@openai/agents";
import z from "zod";
import { IPermittedCategories } from "../constants";

export const fetchPermittedCategories = tool({
  name: "fetch_permitted_categories_tool",
  description: "Return the permitted to-do item categories.",
  parameters: z.object({}),
  execute: (_args, runContext?: RunContext) => {
    const context = runContext?.context as
      | Partial<IPermittedCategories>
      | undefined;
    return `The permitted categories include: ${context?.permittedCategories}`;
  },
});
