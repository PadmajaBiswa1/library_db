import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();

router.get('/', BookController.getAll);
router.get('/:id', BookController.getById);
router.post('/', BookController.create);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.remove);

export default router;
