export interface IPriorityRankingCriteria {
  priorityRankingCriteria: {
    high: string[];
    medium: string[];
  };
}

export const PriorityRankingCriteria: IPriorityRankingCriteria = {
  priorityRankingCriteria: {
    high: [
      "Address Regulatory Constraint",
      "Prevent Loss of Customer",
      "Urgent Intercom Repair",
    ],
    medium: [
      "Reduce Customer Acquisition Cost",
      "Reduce Unit Manufacturing Cost",
      "Standard Intercom Maintenance",
    ],
  },
};
