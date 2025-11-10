import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { budgetService } from './budget.service';
import { GetBudgetSummaryInput, UpsertBudgetInput } from './budget.validation';

class BudgetController {
  getMonthlySummary = catchAsync(async (req: AuthRequest, res: Response) => {
    const summary = await budgetService.getMonthlySummary(
      req.user!._id.toString(),
      req.query as GetBudgetSummaryInput
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Budget summary retrieved successfully',
      data: summary,
    });
  });

  upsertBudget = catchAsync(async (req: AuthRequest, res: Response) => {
    const summary = await budgetService.upsertBudget(
      req.user!._id.toString(),
      req.body as UpsertBudgetInput
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Budget saved successfully',
      data: summary,
    });
  });
}

export const budgetController = new BudgetController();


