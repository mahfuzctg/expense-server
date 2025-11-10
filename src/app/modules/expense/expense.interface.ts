import { ExpenseCategory } from './expense.constant';

export interface IExpense {
  _id?: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpenseQuery {
  category?: ExpenseCategory;
  month?: number;
  year?: number;
  userId?: string;
}

export interface IExpenseChartData {
  category: ExpenseCategory;
  total: number;
  count: number;
}

