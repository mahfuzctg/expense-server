import mongoose from 'mongoose';
import { Expense, IExpenseDocument } from './expense.model';
import { IExpenseQuery, IExpenseChartData } from './expense.interface';
import { CreateExpenseInput, UpdateExpenseInput } from './expense.validation';
import { ExpenseCategory } from './expense.constant';
import { ApiError } from '../../utils/ApiError';

export class ExpenseService {
  /**
   * Create a new expense
   */
  async createExpense(data: CreateExpenseInput, userId: string): Promise<IExpenseDocument> {
    const expense = new Expense({
      ...data,
      createdBy: userId,
    });
    return await expense.save();
  }

  /**
   * Get all expenses with optional filtering (user-specific)
   */
  async getExpenses(query: IExpenseQuery, userId: string): Promise<IExpenseDocument[]> {
    const filter: any = { createdBy: userId };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.month !== undefined) {
      const year = query.year || new Date().getFullYear();
      const month = query.month;

      if (month < 1 || month > 12) {
        throw new ApiError(400, 'Month must be between 1 and 12');
      }

      filter.date = {
        $gte: new Date(year, month - 1, 1, 0, 0, 0, 0),
        $lt: new Date(year, month, 1, 0, 0, 0, 0),
      };
    } else if (query.year !== undefined) {
      filter.date = {
        $gte: new Date(query.year, 0, 1, 0, 0, 0, 0),
        $lt: new Date(query.year + 1, 0, 1, 0, 0, 0, 0),
      };
    }

    return await Expense.find(filter).sort({ date: -1 });
  }

  /**
   * Get a single expense by ID (user-specific)
   */
  async getExpenseById(id: string, userId: string): Promise<IExpenseDocument | null> {
    return await Expense.findOne({ _id: id, createdBy: userId });
  }

  /**
   * Update an expense by ID (user-specific)
   */
  async updateExpense(
    id: string,
    data: UpdateExpenseInput,
    userId: string
  ): Promise<IExpenseDocument | null> {
    const expense = await Expense.findOne({ _id: id, createdBy: userId });
    if (!expense) return null;

    Object.assign(expense, data);
    return await expense.save();
  }

  /**
   * Delete an expense by ID (user-specific)
   */
  async deleteExpense(id: string, userId: string): Promise<boolean> {
    const result = await Expense.findOneAndDelete({ _id: id, createdBy: userId });
    return !!result;
  }

  /**
   * Get expenses by category for chart (user-specific)
   */
  async getExpensesByCategory(userId: string): Promise<IExpenseChartData[]> {
    const expenses = await Expense.aggregate([
      {
        $match: { createdBy: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: { $round: ['$total', 2] },
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const allCategories = Object.values(ExpenseCategory);
    const categoryMap = new Map(expenses.map((item) => [item.category, item]));

    return allCategories.map((category) => {
      const data = categoryMap.get(category);
      return data || { category, total: 0, count: 0 };
    });
  }
}

export const expenseService = new ExpenseService();
