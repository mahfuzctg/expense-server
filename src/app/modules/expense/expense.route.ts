import { Router } from 'express';
import { expenseController } from './expense.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { protect } from '../../middlewares/auth.middleware';
import {
  createExpenseSchema,
  updateExpenseSchema,
  getExpenseSchema,
  deleteExpenseSchema,
  getExpensesQuerySchema,
} from './expense.validation';

const router = Router();

// All routes are protected (require authentication)
router.use(protect);

// Chart endpoint - get expenses by category
router.get('/chart', expenseController.getExpensesChart);

// Get all expenses (with optional filtering)
router.get(
  '/',
  validateRequest(getExpensesQuerySchema),
  expenseController.getExpenses
);

// Create a new expense
router.post(
  '/',
  validateRequest(createExpenseSchema),
  expenseController.createExpense
);

// Get a single expense by ID
router.get(
  '/:id',
  validateRequest(getExpenseSchema),
  expenseController.getExpenseById
);

// Update an expense by ID
router.put(
  '/:id',
  validateRequest(updateExpenseSchema),
  expenseController.updateExpense
);

// Delete an expense by ID
router.delete(
  '/:id',
  validateRequest(deleteExpenseSchema),
  expenseController.deleteExpense
);

export default router;

