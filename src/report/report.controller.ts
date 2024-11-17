import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateReportDto,
  SearchReportDto,
  UpdateReportDto,
} from './dto/request/report.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReportLikesService } from 'src/report-likes/report-likes.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { ReportListResponseDto } from './dto/response/report.dto';
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

  @ApiOkResponse({
    description: '독후감 작성 성공',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '85d157b4-c210-4d34-808f-ba66b1f9db48',
        },
      },
    },
  })
  @Post()
  @UseGuards(AuthGuard)
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Req() req: Request,
  ) {
    const { email } = req.user as User;

    const newReport = await this.reportService.createReport(
      createReportDto,
      email,
    );

    return newReport;
  }

  @ApiOkResponse({
    description: '좋아요 순 독후감 목록 조회 성공',
    type: PickType(ReportListResponseDto, ['items']),
  })
  @Get('/most-liked')
  async getTopLikedReports() {
    const items = await this.reportLikesService.getTopLikedReports();

    return { items };
  }

  @ApiOkResponse({
    description: '최신 독후감 목록 조회 성공',
    type: PickType(ReportListResponseDto, ['items']),
  })
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

  @ApiOkResponse({
    description: '검색 성공',
    type: ReportListResponseDto,
  })
  @Get('search')
  async getReportList(@Query() query: SearchReportDto) {
    return this.reportService.getReportListBySearch(query);
  }

  @ApiNotFoundResponse({
    description: 'Report not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Report not found',
        },
      },
    },
  })
  @Get(':reportId')
  async getReport(@Param('reportId') reportId: string) {
    const report = await this.reportService.getReport(reportId);

    if (report) return report;
    else throw new NotFoundException('Report not found');
  }

  @ApiBadRequestResponse({
    description: '수정 실패',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '수정 실패',
        },
      },
    },
  })
  @ApiOkResponse({
    description: '수정 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '수정 성공',
        },
      },
    },
  })
  @Put(':reportId')
  @UseGuards(AuthGuard)
  async updateReport(
    @Body() updateReportDto: UpdateReportDto,
    @Param('reportId') reportId: string,
  ) {
    const newReport = await this.reportService.updateReport(
      updateReportDto,
      reportId,
    );

    if (newReport) {
      return { message: '수정 성공' };
    } else {
      throw new BadRequestException({
        message: '수정 실패',
      });
    }
  }

  @ApiOkResponse({
    description: '삭제 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '삭제 성공',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: '권한이 없습니다.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '권한이 없습니다.',
        },
      },
    },
  })
  @Delete(':reportId')
  @UseGuards(AuthGuard)
  async deleteReport(@Param('reportId') reportId: string, @Req() req: Request) {
    const { id } = req.user as User;

    const isOwner = await this.reportService.checkIsOwner(reportId, id);

    if (!isOwner) {
      throw new ForbiddenException('권한이 없습니다.');
    } else {
      await this.reportService.deleteReport(reportId);

      return { message: '삭제 성공' };
    }
  }

  @ApiOkResponse({
    description: '좋아요 여부 확인',
    schema: {
      type: 'object',
      properties: {
        isLiked: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
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
