import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificationGateway, NotificationService, NotificationRepository],
  controllers: [NotificationController],
  exports: [NotificationGateway, NotificationService],
  imports: [AuthModule],
})
export class NotificationModule {}
