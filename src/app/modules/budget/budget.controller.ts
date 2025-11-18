import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { budgetService } from './budget.service';

export class BudgetController {
  getBudgetSummary = catchAsync(async (req: AuthRequest, res: Response) => {
    const summary = await budgetService.getBudgetSummary(req.query as any, req.user!._id.toString());

    sendResponse(res, 200, {
      success: true,
      message: 'Budget summary retrieved successfully',
      data: summary,
    });
  });

  upsertBudget = catchAsync(async (req: AuthRequest, res: Response) => {
    const summary = await budgetService.upsertBudget(req.body, req.user!._id.toString());

    sendResponse(res, 200, {
      success: true,
      message: 'Budget updated successfully',
      data: summary,
    });
  });
}

export const budgetController = new BudgetController();


