import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment, CommentList } from './comment.schema';
import { Message } from 'src/util/util.schema';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { ReportService } from 'src/report/report.service';
import { User } from '@prisma/client';
import { CreateComment } from './dto/request/comment.dto';

@Resolver()
export class CommentResolver {
  constructor(
    private reportService: ReportService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  @Query(() => CommentList)
  async getComments(@Args('parentId') parentId: string) {
    const comments = await this.commentService.getComments(parentId);

    return { comments };
  }

  @Mutation(() => Comment)
  @UseGuards(AuthGuard)
  async createComment(
    @Args('createComment') createComment: CreateComment,
    @Context('req')
    { user: { id: userId } }: { user: User },
  ) {
    const res = await this.commentService.createComment({
      ...createComment,
      userId,
    });

    if (!res) {
      throw new InternalServerErrorException('댓글을 작성하지 못했습니다.');
    }

    if (createComment.depth === 0) {
      this.sendNotification(createComment.parentId, userId);
    }

    console.log(res);

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

  @Mutation(() => Message)
  @UseGuards(AuthGuard)
  async putComment(@Args('id') id: string, @Args('comment') comment: string) {
    const res = await this.commentService.putComment(id, comment);

    if (!res) {
      throw new InternalServerErrorException('댓글을 수정하지 못했습니다.');
    }

    return { message: '댓글이 수정되었습니다.' };
  }

  @Mutation(() => Message)
  @UseGuards(AuthGuard)
  async deleteComment(@Args('id') id: string) {
    const res = await this.commentService.deleteComment(id);

    if (!res) {
      throw new InternalServerErrorException('댓글을 삭제하지 못했습니다.');
    }

    return { message: '댓글이 삭제되었습니다.' };
  }
}
