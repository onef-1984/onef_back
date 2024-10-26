import { Module } from '@nestjs/common';
import { CommentsController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentService, CommentRepository],
  imports: [AuthModule, NotificationModule],
})
export class CommentModule {}
