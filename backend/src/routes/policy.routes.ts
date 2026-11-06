import { Router } from 'express';
import { PolicyController } from '../controllers/policy.controller';

const router = Router();

router.get('/', PolicyController.get);
router.put('/', PolicyController.update);

export default router;
