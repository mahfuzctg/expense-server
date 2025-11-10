import { z } from 'zod';

const monthSchema = z
  .coerce.number({
    invalid_type_error: 'Month must be a number',
  })
  .int()
  .min(1)
  .max(12);

const yearSchema = z
  .coerce.number({
    invalid_type_error: 'Year must be a number',
  })
  .int()
  .min(2000)
  .max(2100);

const amountSchema = z
  .coerce.number({
    invalid_type_error: 'Amount must be a number',
    required_error: 'Amount is required',
  })
  .min(0, 'Budget cannot be negative');

export const getBudgetSummarySchema = z.object({
  query: z.object({
    month: monthSchema.optional(),
    year: yearSchema.optional(),
  }),
});

export const upsertBudgetSchema = z.object({
  body: z.object({
    amount: amountSchema,
    month: monthSchema.optional(),
    year: yearSchema.optional(),
  }),
});

export type GetBudgetSummaryInput = z.infer<typeof getBudgetSummarySchema>['query'];
export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>['body'];


