import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { Report, ReportList } from 'src/report/report.schema';
import { ReportService } from 'src/report/report.service';
import { Message } from 'src/util/util.schema';
import { ReportLikesService } from './report-likes.service';
import { IsLiked } from './report-likes.schema';

@Resolver()
export class ReportLikesResolver {
  constructor(
    private reportService: ReportService,
    private reportLikesService: ReportLikesService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  @Query(() => ReportList)
  async getMostLikedReportList() {
    const items = await this.reportLikesService.getMostLikedReportList();

    return { items };
  }

  @Query(() => Report)
  async getReport(@Args('reportId') reportId: string) {
    const res = await this.reportService.getReport(reportId);

    if (!res) {
      throw new NotFoundException({
        message: '해당 독후감이 없습니다',
      });
    }

    return res;
  }

  @UseGuards(AuthGuard)
  @Query(() => IsLiked)
  async checkUserLikedReport(
    @Args('reportId') reportId: string,
    @Context('req') { user }: { user: User },
  ) {
    const isLiked = await this.reportLikesService.isUserLikedReport(
      reportId,
      user.id,
    );

    return { isLiked };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message)
  async toggleReportLike(
    @Args('reportId') reportId: string,
    @Context('req') { user: { id: userId } }: { user: User },
  ) {
    const isOwner = await this.reportService.checkIsOwner(reportId, userId);

    if (isOwner)
      throw new ForbiddenException('자신의 게시물에는 좋아요를 누를 수 없어요');

    const isLiked = await this.reportLikesService.isUserLikedReport(
      reportId,
      userId,
    );

    if (isLiked) {
      await this.reportLikesService.deleteReportLike(reportId, userId);

      return { message: '좋아요 취소' };
    } else {
      await this.reportLikesService.postReportLike(reportId, userId);

      const report = await this.reportService.getReport(reportId);

      const noti = await this.notificationService.createNotification(
        report.user.id,
        {
          senderId: userId,
          reportId: reportId,
          type: 'NEW_LIKE_ON_REPORT',
        },
      );

      this.notificationGateway.sendMessage(report.user.id, noti);

      return { message: '좋아요 성공' };
    }
  }
}
