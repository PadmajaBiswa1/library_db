import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class InventoryController {
  public static async getAudit(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const audit = await InventoryService.getInventoryAudit();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(audit, 'Inventory audit data fetched'));
    } catch (error) {
      next(error);
    }
  }

  public static async adjust(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookId, action, quantity, notes } = req.body;
      const updated = await InventoryService.adjustStock(bookId, action, Number(quantity), notes);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(updated, 'Inventory stock adjusted'));
    } catch (error) {
      next(error);
    }
  }
}
