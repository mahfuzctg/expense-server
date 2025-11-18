import mongoose from 'mongoose';
import { Budget } from './budget.model';
import { Expense } from '../expense/expense.model';
import { GetBudgetQuery, UpsertBudgetInput } from './budget.validation';
import { IBudgetSummary, BudgetStatus, IBudget } from './budget.interface';

const resolvePeriod = (month?: number, year?: number) => {
  const now = new Date();
  return {
    month: month ?? now.getMonth() + 1,
    year: year ?? now.getFullYear(),
  };
};

const buildStatus = (amount: number, totalExpenses: number): BudgetStatus => {
  if (amount <= 0) {
    return 'not_set';
  }

  if (totalExpenses > amount) {
    return 'danger';
  }

  if (totalExpenses >= amount * 0.8) {
    return 'warning';
  }

  return 'safe';
};

export class BudgetService {
  async upsertBudget(data: UpsertBudgetInput, userId: string): Promise<IBudgetSummary> {
    const { month, year } = resolvePeriod(data.month, data.year);

    await Budget.findOneAndUpdate(
      { createdBy: userId, month, year },
      {
        $set: {
          amount: data.amount,
        },
        $setOnInsert: {
          createdBy: userId,
          month,
          year,
        },
      },
      { new: true, upsert: true }
    );

    return this.getBudgetSummary({ month, year }, userId);
  }

  async getBudgetSummary(query: GetBudgetQuery, userId: string): Promise<IBudgetSummary> {
    const { month, year } = resolvePeriod(query.month, query.year);

    const [budget, totalExpenses] = await Promise.all([
      Budget.findOne({ createdBy: userId, month, year }),
      this.getMonthlyExpenseTotal(userId, month, year),
    ]);

    const amount = budget?.amount ?? 0;
    const hasBudget = amount > 0;
    const percentage = hasBudget && amount > 0 ? Number(((totalExpenses / amount) * 100).toFixed(2)) : 0;
    const remaining = hasBudget ? Number((amount - totalExpenses).toFixed(2)) : 0;
    const status = buildStatus(amount, totalExpenses);

    const budgetData = budget ? (budget.toJSON() as unknown as IBudget) : null;

    return {
      budget: budgetData,
      totalExpenses: Number(totalExpenses.toFixed(2)),
      remaining,
      percentage,
      month,
      year,
      status,
      hasBudget,
    };
  }

  private async getMonthlyExpenseTotal(userId: string, month: number, year: number): Promise<number> {
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0, 0);

    const result = await Expense.aggregate<{ _id: null; total: number }>([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }
}

export const budgetService = new BudgetService();


