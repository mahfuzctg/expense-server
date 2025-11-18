import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { getBudgetQuerySchema, upsertBudgetSchema } from './budget.validation';
import { budgetController } from './budget.controller';

const router = Router();

router.use(protect);

router.get('/', validateRequest(getBudgetQuerySchema), budgetController.getBudgetSummary);
router.put('/', validateRequest(upsertBudgetSchema), budgetController.upsertBudget);

export default router;


