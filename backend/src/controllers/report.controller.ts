import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class ReportController {
  public static async getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ReportService.generateComprehensiveReport();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(data, 'Library reports generated'));
    } catch (error) {
      next(error);
    }
  }
}
