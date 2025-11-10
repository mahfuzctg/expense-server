import { z } from 'zod';
import { EXPENSE_CATEGORIES } from './expense.constant';

const idSchema = z.string().min(1, 'Expense ID is required');
const titleSchema = z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters');
const categorySchema = z.string().refine(
  (val) => EXPENSE_CATEGORIES.includes(val as (typeof EXPENSE_CATEGORIES)[number]),
  { message: 'Invalid category' }
);
const amountSchema = z.number().min(0.01, 'Amount must be at least 0.01');
const dateSchema = z.coerce.date({ required_error: 'Date is required', invalid_type_error: 'Invalid date format' });

export const createExpenseSchema = z.object({
  body: z.object({
    title: titleSchema,
    category: categorySchema,
    amount: amountSchema,
    date: dateSchema,
  }),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    title: titleSchema.optional(),
    category: categorySchema.optional(),
    amount: amountSchema.optional(),
    date: z.coerce.date({ invalid_type_error: 'Invalid date format' }).optional(),
  }),
});

const paramsWithId = z.object({ params: z.object({ id: idSchema }) });

export const getExpenseSchema = paramsWithId;
export const deleteExpenseSchema = paramsWithId;

export const getExpensesQuerySchema = z.object({
  query: z.object({
    category: categorySchema.optional(),
    month: z.coerce.number().min(1).max(12).optional(),
    year: z.coerce.number().min(2000).max(2100).optional(),
  }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>['body'];
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>['body'];
export type GetExpensesQuery = z.infer<typeof getExpensesQuerySchema>['query'];
