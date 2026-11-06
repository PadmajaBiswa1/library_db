import { db } from '../config/database';
import { INotification } from '../types';
import { ApiError } from '../utils/apiError';

export class NotificationService {
  public static async getAllNotifications(): Promise<INotification[]> {
    return db.notifications;
  }

  public static async markAsRead(id: string): Promise<INotification> {
    const notif = db.notifications.find((n) => n.id === id);
    if (!notif) {
      throw ApiError.notFound(`Notification '${id}' not found`);
    }
    notif.isRead = true;
    return notif;
  }

  public static async markAllAsRead(): Promise<void> {
    db.notifications.forEach((n) => {
      n.isRead = true;
    });
  }

  public static async broadcastAnnouncement(title: string, message: string): Promise<INotification> {
    if (!title || !message) {
      throw ApiError.badRequest('Both title and message are required for an announcement');
    }

    const notif: INotification = {
      id: `notif-${Date.now()}`,
      type: 'ANNOUNCEMENT',
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    db.notifications.unshift(notif);
    return notif;
  }
}
