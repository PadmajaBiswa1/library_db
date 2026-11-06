import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class StatsController {
  public static async getMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await StatsService.getDashboardMetrics();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats, 'Dashboard statistics fetched'));
    } catch (error) {
      next(error);
    }
  }
}
