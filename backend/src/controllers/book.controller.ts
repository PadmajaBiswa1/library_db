import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class BookController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, subject, availability } = req.query;
      const books = await BookService.getAllBooks({
        search: search as string,
        category: category as string,
        subject: subject as string,
        availability: availability as string,
      });
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(books, 'Books fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await BookService.getBookById(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(book, 'Book details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newBook = await BookService.createBook(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(newBook, 'Book created successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await BookService.updateBook(req.params.id as string, req.body);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(updated, 'Book updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await BookService.deleteBook(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, 'Book deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
