import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotiType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async createNotification(
    receiverId: string,
    message: { senderId: string; reportId: string; type: NotiType },
  ) {
    const res = await this.notificationRepository.createNotification(
      receiverId,
      message,
    );

    const notificationList =
      await this.notificationRepository.getNotifications(receiverId);

    // 알림은 최대 15개까지만 저장
    if (notificationList.length >= 15) {
      await this.notificationRepository.deleteNotification(
        notificationList.at(-1).id,
      );
    }

    return res;
  }

  getNotification(id: string) {
    return this.notificationRepository.getNotification(id);
  }

  getNotifications(receiverId: string) {
    return this.notificationRepository.getNotifications(receiverId);
  }

  patchNotification(id: string, data: { isRead?: boolean }) {
    return this.notificationRepository.patchNotification(id, data);
  }

  deleteNotification(id: string) {
    return this.notificationRepository.deleteNotification(id);
  }
}
