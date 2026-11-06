import { Request, Response, NextFunction } from 'express';
import { ShelfService } from '../services/shelf.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class ShelfController {
  public static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shelves = await ShelfService.getAllShelves();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(shelves, 'Shelf locations retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shelf = await ShelfService.createShelf(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(shelf, 'Rack location created'));
    } catch (error) {
      next(error);
    }
  }

  public static async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { block, rack } = req.params;
      const books = await ShelfService.getBooksOnShelf(block as string, rack as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(books, 'Books on shelf fetched'));
    } catch (error) {
      next(error);
    }
  }
}
