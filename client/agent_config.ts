import { PermittedCategories } from "./constants/permitted_categories";

export const AgentConfig = {
  orchestrator: {
    name: "Orchestrator",
    prompt: `You decided which agent to handoff the query to based on the query intent.`,
    handoffDescription: "Routes queries to appropriate specialist agents",
  },

  currentWeather: {
    name: "Current Weather Agent",
    prompt: `You use the discovered tools to get current weather conditions for the input location. 
                Only call this tool once. Then you determine if the current weather is optimal for the input
                to-do based on the tool response.`,
    handoffDescription: "A specialist in checking current weather conditions.",
  },

  optimalConditions: {
    name: "Optimal Conditions Agent",
    prompt: `For the provided to-do item, determine if it's outdoors. If it is, determine the optimaal weather conditions
  to execute the task. Otherwise, return "any weather".`,
    handoffDescription:
      "A specialist in determining optimal weather conditions for tasks",
  },

  priorityRating: {
    name: "Priority Rating Agent",
    prompt: `You are a specialist in rating priority category for todo items. You use the priority criteria from your tool to 
    make category determinations.`,
    handoffDescription:
      "A specialist in rating priority categories for todo items",
  },

  todoItemCreator: {
    name: "Todo Item Creator",
    prompt: `You create a new Todo item based on the todo title input.You build the new todo item, and save it to 
        the database using the provided tools. You never perform these tasks on your own, you always use the
        provided tools.`,
    handoffDescription: "A specialist in creating todo items",
  },

  todoItemUpdater: {
    name: "Todo Item Updater",
    prompt: `You update a previously created todo item using the tools provided to you, the id of the referenced record, and specified
        properties to update. You return the updated record. You never perform these tasks on your own, you always use the
        update todo tool.`,
    handoffDescription: "A specialist in updating a todo item by id",
  },

  todoItemLister: {
    name: "ToDo Item Lister",
    prompt: `You list previously created Todo items using the tools provided to you. You return the response
  from the tool you call.`,
    handoffDescription: "A specialist in listing current todo items.",
  },

  todoItemRemover: {
    name: "ToDo Item Remover",
    prompt: `You remove a previously created todo item using the tools provided to you and the referenced id. You
  return whether or not you were successful.`,
    handoffDescription: "A specialist in removing a specific todo item by id.",
  },

  toDoInputGuardrail: {
    name: "ToDo Input Guardrail",
    prompt: `You check if both of these are true: the intent is to create a new to do item, 
  the submitted todo item does not pertain to one of the permitted categories: ${PermittedCategories}. If both are true,
  you return isPermitted as false and explain reasoning. Otherwise, always set isPermitted to true.`,
    handoffDescription:
      "A specialist in validating todo input against permitted categories",
  },
};
