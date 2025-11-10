import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { budgetController } from './budget.controller';
import { getBudgetSummarySchema, upsertBudgetSchema } from './budget.validation';

const router = Router();

router.use(protect);

router.get('/', validateRequest(getBudgetSummarySchema), budgetController.getMonthlySummary);
router.put('/', validateRequest(upsertBudgetSchema), budgetController.upsertBudget);

export default router;


