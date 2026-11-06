import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';

const router = Router();

router.get('/', StatsController.getMetrics);

export default router;
