export interface IBudget {
  _id?: string;
  amount: number;
  month: number; // 1-12
  year: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BudgetStatus = 'empty' | 'ok' | 'warning' | 'danger';

export interface IBudgetSummary {
  budgetId?: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
  status: BudgetStatus;
}


