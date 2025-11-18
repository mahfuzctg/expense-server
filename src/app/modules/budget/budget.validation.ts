import { z } from 'zod';

const monthSchema = z.coerce.number().min(1).max(12);
const yearSchema = z.coerce.number().min(2000).max(2100);
const amountSchema = z.coerce.number().min(0, 'Budget must be zero or greater');

export const getBudgetQuerySchema = z.object({
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

export type GetBudgetQuery = z.infer<typeof getBudgetQuerySchema>['query'];
export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>['body'];


