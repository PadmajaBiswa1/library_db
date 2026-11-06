import { Router } from 'express';
import bookRoutes from './book.routes';
import memberRoutes from './member.routes';
import loanRoutes from './loan.routes';
import reservationRoutes from './reservation.routes';
import fineRoutes from './fine.routes';
import digitalRoutes from './digital.routes';
import inventoryRoutes from './inventory.routes';
import shelfRoutes from './shelf.routes';
import notificationRoutes from './notification.routes';
import reportRoutes from './report.routes';
import policyRoutes from './policy.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/books', bookRoutes);
router.use('/members', memberRoutes);
router.use('/loans', loanRoutes);
router.use('/reservations', reservationRoutes);
router.use('/fines', fineRoutes);
router.use('/digital', digitalRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/shelves', shelfRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/policies', policyRoutes);
router.use('/stats', statsRoutes);

export default router;
