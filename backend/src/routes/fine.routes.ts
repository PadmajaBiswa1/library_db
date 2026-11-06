import { Router } from 'express';
import { FineController } from '../controllers/fine.controller';

const router = Router();

router.get('/', FineController.getAll);
router.get('/summary', FineController.getSummary);
router.patch('/:id/pay', FineController.pay);
router.patch('/:id/waive', FineController.waive);

export default router;
