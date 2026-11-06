import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();

router.get('/audit', InventoryController.getAudit);
router.post('/adjust', InventoryController.adjust);

export default router;
