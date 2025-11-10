import { Response } from 'express';
import { expenseService } from './expense.service';
import { IExpenseQuery } from './expense.interface';
import { GetExpensesQuery } from './expense.validation';
import { ExpenseCategory } from './expense.constant';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ApiError } from '../../utils/ApiError';

/**
 * Helper function to build a descriptive message based on applied filters
 */
const buildFilterMessage = (filter: IExpenseQuery): string => {
  const filters: string[] = [];

  if (filter.category) {
    filters.push(`category: ${filter.category}`);
  }

  if (filter.month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[filter.month - 1];
    const year = filter.year || new Date().getFullYear();
    filters.push(`month: ${monthName} ${year}`);
  } else if (filter.year) {
    filters.push(`year: ${filter.year}`);
  }

  if (filters.length === 0) {
    return 'Expenses retrieved successfully';
  }

  return `Expenses retrieved successfully (filtered by: ${filters.join(', ')})`;
};

export class ExpenseController {
  /**
   * Create a new expense
   */
  createExpense = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const expense = await expenseService.createExpense(
        req.body,
        req.user!._id.toString()
      );

      sendResponse(res, 201, {
        success: true,
        message: 'Expense created successfully',
        data: expense,
      });
    }
  );

  /**
   * Get all expenses with optional filtering
   * 
   * Query Parameters:
   * - category: Filter by category (Food, Transport, Utilities, Other)
   * - month: Filter by month (1-12, extracted from expense date)
   * - year: Filter by year (optional, defaults to current year if month is provided)
   * 
   * Examples:
   * - GET /api/expenses?category=Food
   * - GET /api/expenses?month=10
   * - GET /api/expenses?category=Food&month=10
   * - GET /api/expenses?category=Transport&month=10&year=2024
   */
  getExpenses = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const query = req.query as unknown as GetExpensesQuery;
      const filter: IExpenseQuery = {};

      // Extract and validate category filter
      if (query.category) {
        if (Object.values(ExpenseCategory).includes(query.category as ExpenseCategory)) {
          filter.category = query.category as ExpenseCategory;
        } else {
          throw new ApiError(400, `Invalid category. Must be one of: ${Object.values(ExpenseCategory).join(', ')}`);
        }
      }

      // Extract month filter (1-12)
      if (query.month !== undefined) {
        const month = Number(query.month);
        if (month >= 1 && month <= 12) {
          filter.month = month;
        } else {
          throw new ApiError(400, 'Month must be between 1 and 12');
        }
      }

      // Extract year filter (optional)
      if (query.year !== undefined) {
        const year = Number(query.year);
        if (year >= 2000 && year <= 2100) {
          filter.year = year;
        } else {
          throw new ApiError(400, 'Year must be between 2000 and 2100');
        }
      }

      // Get filtered expenses from MongoDB
      const expenses = await expenseService.getExpenses(
        filter,
        req.user!._id.toString()
      );

      // Build response metadata
      const responseMessage = buildFilterMessage(filter);

      // Return filtered results in clean JSON format
      sendResponse(res, 200, {
        success: true,
        message: responseMessage,
        count: expenses.length,
        filters: {
          category: filter.category || null,
          month: filter.month || null,
          year: filter.year || null,
        },
        data: expenses,
      });
    }
  );

  /**
   * Get a single expense by ID
   */
  getExpenseById = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(
        id,
        req.user!._id.toString()
      );

      if (!expense) {
        throw new ApiError(404, 'Expense not found');
      }

      sendResponse(res, 200, {
        success: true,
        message: 'Expense retrieved successfully',
        data: expense,
      });
    }
  );

  /**
   * Update an expense by ID
   */
  updateExpense = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;
      const expense = await expenseService.updateExpense(
        id,
        req.body,
        req.user!._id.toString()
      );

      if (!expense) {
        throw new ApiError(404, 'Expense not found');
      }

      sendResponse(res, 200, {
        success: true,
        message: 'Expense updated successfully',
        data: expense,
      });
    }
  );

  /**
   * Delete an expense by ID
   */
  deleteExpense = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;
      const deleted = await expenseService.deleteExpense(
        id,
        req.user!._id.toString()
      );

      if (!deleted) {
        throw new ApiError(404, 'Expense not found');
      }

      sendResponse(res, 200, {
        success: true,
        message: 'Expense deleted successfully',
      });
    }
  );

  /**
   * Get expenses by category for chart
   */
  getExpensesChart = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const chartData = await expenseService.getExpensesByCategory(
        req.user!._id.toString()
      );

      sendResponse(res, 200, {
        success: true,
        message: 'Chart data retrieved successfully',
        data: chartData,
      });
    }
  );
}

export const expenseController = new ExpenseController();
