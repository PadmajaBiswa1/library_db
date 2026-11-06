import { Router } from 'express';
import { DigitalController } from '../controllers/digital.controller';

const router = Router();

router.get('/', DigitalController.getAll);
router.get('/:id', DigitalController.getById);
router.post('/', DigitalController.create);
router.post('/:id/download', DigitalController.recordDownload);
router.delete('/:id', DigitalController.remove);

export default router;
