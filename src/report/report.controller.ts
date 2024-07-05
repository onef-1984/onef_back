import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './report.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard())
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

  @Get(':reportId')
  async getReport(@Param('reportId') reportId: string) {
    return this.reportService.getReport(reportId);
  }

  @Delete(':reportId')
  @UseGuards(AuthGuard())
  async deleteReport(@Param('reportId') reportId: string, @Req() req: Request) {
    const { email } = req.user as User;

    const isOwner = await this.reportService.checkIsOwner(reportId, email);

    if (!isOwner) {
      throw new ForbiddenException('권한이 없습니다.');
    } else {
      return this.reportService.deleteReport(reportId);
    }
  }
}
