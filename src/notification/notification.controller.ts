import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getNotification(@Req() req) {
    const { id: receiverId } = req.user as User;

    const res = await this.notificationService.getNotifications(receiverId);

    return res ?? [];
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async patchNotification(
    @Param('id') id: string,
    @Body() body: { isRead?: boolean },
  ) {
    return this.notificationService.patchNotification(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteNotification(@Param('id') id: string, @Req() req) {
    const { id: userId } = req.user as User;

    const res = await this.notificationService.getNotification(id);

    if (userId !== res?.receiverId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    return this.notificationService.deleteNotification(id);
  }
}
