import { RunContext, tool } from "@openai/agents";
import z from "zod";

interface IPermittedCategories {
  permittedCategories: string[];
}

export const fetchPermittedCategories = tool({
  name: "fetch_permitted_categories_tool",
  description: "Return the permitted to-do item categories.",
  parameters: z.object({}),
  execute: (_args, runContext?: RunContext<IPermittedCategories>) => {
    return `The permitted categories include: ${runContext.context.permittedCategories}`;
  },
});
