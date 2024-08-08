import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
} from './report.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReportLikesService } from 'src/report-likes/report-likes.service';

@Controller('report')
export class ReportController {
  constructor(
    private reportService: ReportService,
    private reportLikesService: ReportLikesService,
  ) {}

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

  @Get('search')
  async getReportList(@Query() query: SearchReportDto) {
    return this.reportService.getReportListBySearch(query);
  }

  @Get(':reportId')
  async getReport(@Param('reportId') reportId: string) {
    return this.reportService.getReport(reportId);
  }

  @Put(':reportId')
  @UseGuards(AuthGuard)
  async updateReport(
    @Body() updateReportDto: UpdateReportDto,
    @Param('reportId') reportId: string,
  ) {
    return this.reportService.updateReport(updateReportDto, reportId);
  }

  @Delete(':reportId')
  @UseGuards(AuthGuard)
  async deleteReport(@Param('reportId') reportId: string, @Req() req: Request) {
    const { id } = req.user as User;

    const isOwner = await this.reportService.checkIsOwner(reportId, id);

    if (!isOwner) {
      throw new ForbiddenException('권한이 없습니다.');
    } else {
      return this.reportService.deleteReport(reportId);
    }
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

        return { message: '좋아요 성공' };
      } catch (err) {
        console.log(err);

        return { message: '이미 좋아요를 누르셨습니다.' };
      }
    }
  }

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
      console.log(err);
      return { message: '이미 좋아요를 취소하셨습니다.' };
    }
  }
}
