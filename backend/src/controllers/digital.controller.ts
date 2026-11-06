import { Request, Response, NextFunction } from 'express';
import { DigitalService } from '../services/digital.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class DigitalController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, type } = req.query;
      const list = await DigitalService.getAllResources({
        search: search as string,
        category: category as string,
        type: type as string,
      });
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(list, 'Digital resources retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resource = await DigitalService.getResourceById(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(resource, 'Digital resource details'));
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resource = await DigitalService.createResource(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(resource, 'Digital resource uploaded'));
    } catch (error) {
      next(error);
    }
  }

  public static async recordDownload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await DigitalService.incrementDownload(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success({ downloadCount: count }, 'Download recorded'));
    } catch (error) {
      next(error);
    }
  }

  public static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DigitalService.deleteResource(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, 'Resource deleted'));
    } catch (error) {
      next(error);
    }
  }
}
