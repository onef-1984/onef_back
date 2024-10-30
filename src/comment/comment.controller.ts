import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { User } from '@prisma/client';
import {
  CreateCommentBodyDto,
  CreateCommentParamDto,
  PutCommentDto,
} from './dto/request/comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReportService } from 'src/report/report.service';
import { NotificationService } from 'src/notification/notification.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private reportService: ReportService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  @Get(':parentId')
  async getComments(@Param('parentId') parentId: string) {
    const comments = await this.commentService.getComments(parentId);

    return { comments };
  }

  @Post(':parentId')
  @UseGuards(AuthGuard)
  async createComment(
    @Param() param: CreateCommentParamDto,
    @Body() body: CreateCommentBodyDto,
    @Req() req,
  ) {
    const { id: userId } = req.user as User;

    const res = await this.commentService.createComment({
      ...param,
      ...body,
      userId,
    });

    if (!res) {
      throw new InternalServerErrorException('댓글을 작성하지 못했습니다.');
    }

    if (body.depth === 0) {
      this.sendNotification(param.parentId, userId);
    }

    return res;
  }

  async sendNotification(parentId, userId) {
    // 댓글이 달리게 될 게시물 조회
    const report = await this.reportService.getReport(parentId);

    if (report.user.id !== userId) {
      // 게시글 작성자의 알림 테이블에 알림 생성
      const noti = await this.notificationService.createNotification(
        report.user.id,
        {
          senderId: userId,
          reportId: parentId,
          type: 'NEW_COMMENT_ON_REPORT',
        },
      );

      // 알림 보내기
      this.notificationGateway.sendMessage(report.user.id, noti);
    }
  }

  @Put(':parentId')
  @UseGuards(AuthGuard)
  async putComment(
    @Param('parentId') parentId: string,
    @Body() body: PutCommentDto,
    // @Req() req,
  ) {
    // const { id: userId } = req.user as User;

    const res = await this.commentService.putComment(parentId, body);

    if (!res) {
      throw new InternalServerErrorException('댓글을 수정하지 못했습니다.');
    }

    return { message: '댓글이 수정되었습니다.' };
  }

  @Delete(':parentId')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('parentId') parentId: string) {
    const res = await this.commentService.deleteComment(parentId);

    if (!res) {
      throw new InternalServerErrorException('댓글을 삭제하지 못했습니다.');
    }

    return { message: '댓글이 삭제되었습니다.' };
  }
}
