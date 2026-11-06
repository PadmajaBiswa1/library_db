import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class NotificationController {
  public static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifs = await NotificationService.getAllNotifications();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notifs, 'Notifications retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notif = await NotificationService.markAsRead(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notif, 'Notification marked as read'));
    } catch (error) {
      next(error);
    }
  }

  public static async markAllRead(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await NotificationService.markAllAsRead();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, 'All notifications marked as read'));
    } catch (error) {
      next(error);
    }
  }

  public static async broadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notif = await NotificationService.broadcastAnnouncement(req.body.title, req.body.message);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(notif, 'Announcement broadcasted'));
    } catch (error) {
      next(error);
    }
  }
}
