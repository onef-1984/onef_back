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

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

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
}
