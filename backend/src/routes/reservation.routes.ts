import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';

const router = Router();

router.get('/', ReservationController.getAll);
router.post('/', ReservationController.create);
router.patch('/:id/cancel', ReservationController.cancel);
router.patch('/:id/fulfill', ReservationController.fulfill);

export default router;
