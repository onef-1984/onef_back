import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  imports: [AuthModule, NotificationModule],
})
export class CommentModule {}
