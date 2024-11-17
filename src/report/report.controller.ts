import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SearchReportDto } from './report.schema';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReportLikesService } from 'src/report-likes/report-likes.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(
    private reportService: ReportService,
    private reportLikesService: ReportLikesService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  @Get('/most-liked')
  async getTopLikedReports() {
    const items = await this.reportLikesService.getTopLikedReports();

    return { items };
  }

  @Get('/recent')
  async getRecentReports() {
    return this.reportService.getReportListBySearch({
      keyword: '',
      orderBy: 'createdAt',
      searchType: 'report',
      take: '12',
      skip: '0',
    });
  }

  @Get('search')
  async getReportList(@Query() query: SearchReportDto) {
    return this.reportService.getReportListBySearch(query);
  }

  @Get('/:reportId/like')
  @UseGuards(AuthGuard)
  async checkUserLikedReport(
    @Param('reportId') reportId: string,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as User;

    const isLiked = await this.reportLikesService.isUserLikedReport(
      reportId,
      userId,
    );

    return { isLiked };
  }

  @ApiOkResponse({
    description: '좋아요 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '좋아요 취소',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '이미 좋아요를 취소하셨습니다.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '이미 좋아요를 누르셨습니다.',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: '자신의 게시물에는 좋아요를 누를 수 없습니다.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '자신의 게시물에는 좋아요를 누를 수 없습니다.',
        },
      },
    },
  })
  @Post('/:reportId/like')
  @UseGuards(AuthGuard)
  async postReportLike(
    @Param('reportId') reportId: string,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as User;

    const isOwner = await this.reportService.checkIsOwner(reportId, userId);

    if (isOwner) {
      throw new ForbiddenException(
        '자신의 게시물에는 좋아요를 누를 수 없습니다.',
      );
    } else {
      try {
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
      } catch (err) {
        return { message: '이미 좋아요를 누르셨습니다.' };
      }
    }
  }

  @ApiOkResponse({
    description: '좋아요 취소 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '좋아요 취소',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '이미 좋아요를 취소하셨습니다.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '이미 좋아요를 취소하셨습니다.',
        },
      },
    },
  })
  @Delete('/:reportId/like')
  @UseGuards(AuthGuard)
  async deleteReportLike(
    @Param('reportId') reportId: string,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as User;

    try {
      await this.reportLikesService.deleteReportLike(reportId, userId);

      return { message: '좋아요 취소' };
    } catch (err) {
      throw new BadRequestException({
        message: '이미 좋아요를 취소하셨습니다.',
      });
    }
  }
}
