import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();

router.get('/', LoanController.getAll);
router.post('/issue', LoanController.issue);
router.patch('/:id/return', LoanController.returnBook);
router.patch('/:id/renew', LoanController.renew);

export default router;
