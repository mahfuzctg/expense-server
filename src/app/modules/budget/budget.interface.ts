export interface IBudget {
  _id?: string;
  id?: string;
  amount: number;
  month: number;
  year: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BudgetStatus = 'safe' | 'warning' | 'danger' | 'not_set';

export interface IBudgetSummary {
  budget: IBudget | null;
  totalExpenses: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
  status: BudgetStatus;
  hasBudget: boolean;
}


