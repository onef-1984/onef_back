import { Injectable } from '@nestjs/common';
import { NotiType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  createNotification(
    receiverId: string,
    message: { senderId: string; reportId: string; type: NotiType },
  ) {
    return this.prisma.notification.create({
      data: {
        type: message.type,
        receiver: { connect: { id: receiverId } },
        sender: { connect: { id: message.senderId } },
        report: { connect: { id: message.reportId } },
      },
    });
  }

  getNotification(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  getNotifications(receiverId: string) {
    return this.prisma.notification.findMany({
      where: { receiverId },
      orderBy: { updatedAt: 'desc' },
      include: {
        sender: { select: { id: true, nickname: true, profileImage: true } },
        receiver: { select: { id: true, nickname: true, profileImage: true } },
        report: { select: { id: true, title: true } },
      },
      omit: { senderId: true, receiverId: true, reportId: true },
    });
  }

  patchNotification(id: string, data: { isRead?: boolean }) {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  deleteNotification(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
