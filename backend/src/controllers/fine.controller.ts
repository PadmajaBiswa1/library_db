import { Request, Response, NextFunction } from 'express';
import { FineService } from '../services/fine.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class FineController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const fines = await FineService.getAllFines(status as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(fines, 'Fines fetched'));
    } catch (error) {
      next(error);
    }
  }

  public static async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await FineService.getFineSummary();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(summary, 'Fine summary fetched'));
    } catch (error) {
      next(error);
    }
  }

  public static async pay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fine = await FineService.payFine(req.params.id as string, req.body.paymentMethod);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(fine, 'Fine payment recorded successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async waive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fine = await FineService.waiveFine(req.params.id as string, req.body.reason);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(fine, 'Fine waived successfully'));
    } catch (error) {
      next(error);
    }
  }
}
