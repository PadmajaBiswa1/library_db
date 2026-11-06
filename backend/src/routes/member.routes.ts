import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';

const router = Router();

router.get('/', MemberController.getAll);
router.get('/:id', MemberController.getById);
router.get('/:id/history', MemberController.getHistory);
router.post('/', MemberController.create);
router.patch('/:id/status', MemberController.updateStatus);

export default router;
