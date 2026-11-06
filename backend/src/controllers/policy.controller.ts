import { Request, Response, NextFunction } from 'express';
import { PolicyService } from '../services/policy.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class PolicyController {
  public static async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policies = await PolicyService.getPolicies();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(policies, 'Library policies retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await PolicyService.updatePolicies(req.body);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(updated, 'Library policies updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}
