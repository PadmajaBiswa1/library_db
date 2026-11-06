import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';

const router = Router();

router.get('/', ReportController.getAnalytics);

export default router;
