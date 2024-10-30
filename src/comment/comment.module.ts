import { Module } from '@nestjs/common';
import { CommentsController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ReportModule } from 'src/report/report.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentService, CommentRepository],
  imports: [AuthModule, NotificationModule, ReportModule],
})
export class CommentModule {}
