import { Router } from 'express';
import { ShelfController } from '../controllers/shelf.controller';

const router = Router();

router.get('/', ShelfController.getAll);
router.post('/', ShelfController.create);
router.get('/:block/:rack/books', ShelfController.getBooks);

export default router;
