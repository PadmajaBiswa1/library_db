import { Request, Response, NextFunction } from 'express';
import { LoanService } from '../services/loan.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class LoanController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, memberIdentifier } = req.query;
      const loans = await LoanService.getAllLoans({
        status: status as string,
        memberIdentifier: memberIdentifier as string,
      });
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(loans, 'Loans fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async issue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await LoanService.issueBook(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(loan, 'Book issued successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async returnBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await LoanService.returnBook(req.params.id as string, req.body);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(loan, 'Book returned successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async renew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await LoanService.renewBook(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(loan, 'Book loan renewed successfully'));
    } catch (error) {
      next(error);
    }
  }
}
