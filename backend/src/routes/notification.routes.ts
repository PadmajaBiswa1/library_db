import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

router.get('/', NotificationController.getAll);
router.patch('/read-all', NotificationController.markAllRead);
router.patch('/:id/read', NotificationController.markRead);
router.post('/broadcast', NotificationController.broadcast);

export default router;
