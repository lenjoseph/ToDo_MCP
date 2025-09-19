enum ToDoStatus {
  incomplete = "Incomplete",
  inProgress = "In Progress",
  complete = "Complete",
}

enum PriorityRating {
  low = "Low",
  medium = "Medium",
  high = "High",
}

enum ToDoCategory {
  customer_acquisition = "Customer Acquisition",
  operational_efficiency = "Operational Efficiency",
  product_manufacturing = "Product Manufacturing",
  system_management = "System Management",
  financial_optimization = "Financial Optimization",
  product_servicing_repairs = "Product Servicing & Repairs",
}

export type ToDo = {
  id: string;
  title: string;
  status: ToDoStatus;
  category: ToDoCategory;
  // categorical rating to influence order of execution
  priorityRating: PriorityRating;
  //   if this to do item requires certain weather conditions, notate
  optimalWeatherConditions?: string;
  createdAt: string;
  updatedAt: string;
};
