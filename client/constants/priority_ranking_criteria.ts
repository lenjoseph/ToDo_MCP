export interface IPriorityRankingCriteria {
  high: string[];
  medium: string[];
}

export const PriorityRankingCriteria: IPriorityRankingCriteria = {
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
};
