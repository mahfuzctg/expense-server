import mongoose from 'mongoose';
import { Budget } from './budget.model';
import { Expense } from '../expense/expense.model';
import { IBudgetSummary, BudgetStatus } from './budget.interface';
import { GetBudgetSummaryInput, UpsertBudgetInput } from './budget.validation';

const resolvePeriod = (month?: number, year?: number) => {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();
  return {
    month: targetMonth,
    year: targetYear,
    range: {
      start: new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0),
      end: new Date(targetYear, targetMonth, 1, 0, 0, 0, 0),
    },
  };
};

class BudgetService {
  private async calculateMonthlySpending(
    userId: string,
    start: Date,
    end: Date
  ): Promise<number> {
    const [result] = await Expense.aggregate([
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

    return result?.total ?? 0;
  }

  private buildStatus(amount: number, spent: number): BudgetStatus {
    if (amount <= 0) {
      return 'empty';
    }

    if (spent >= amount) {
      return 'danger';
    }

    if (spent >= amount * 0.8) {
      return 'warning';
    }

    return 'ok';
  }

  private formatSummary(
    params: { month: number; year: number; amount: number; spent: number },
    budgetId?: string
  ): IBudgetSummary {
    const { month, year, amount, spent } = params;
    const remaining = Math.max(amount - spent, 0);
    const percentage = amount > 0 ? Math.min((spent / amount) * 100, 999) : 0;

    return {
      budgetId,
      month,
      year,
      amount: Number(amount.toFixed(2)),
      spent: Number(spent.toFixed(2)),
      remaining: Number(remaining.toFixed(2)),
      percentage: Number(percentage.toFixed(1)),
      status: this.buildStatus(amount, spent),
    };
  }

  async getMonthlySummary(
    userId: string,
    query: GetBudgetSummaryInput
  ): Promise<IBudgetSummary> {
    const { month, year, range } = resolvePeriod(query.month, query.year);
    const budget = await Budget.findOne({ createdBy: userId, month, year });
    const spent = await this.calculateMonthlySpending(userId, range.start, range.end);

    return this.formatSummary(
      {
        month,
        year,
        amount: budget?.amount ?? 0,
        spent,
      },
      budget?.id
    );
  }

  async upsertBudget(
    userId: string,
    payload: UpsertBudgetInput
  ): Promise<IBudgetSummary> {
    const { month, year, range } = resolvePeriod(payload.month, payload.year);

    const budget = await Budget.findOneAndUpdate(
      { createdBy: userId, month, year },
      {
        $set: {
          amount: payload.amount,
          month,
          year,
          createdBy: userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    if (!budget) {
      throw new Error('Unable to save budget');
    }

    const spent = await this.calculateMonthlySpending(userId, range.start, range.end);

    return this.formatSummary(
      {
        month,
        year,
        amount: budget.amount,
        spent,
      },
      budget.id
    );
  }
}

export const budgetService = new BudgetService();


