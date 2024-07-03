import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './report.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('report')
export class ReportController {
  constructor() {}

  @Post()
  @UseGuards(AuthGuard())
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Req() req: Request,
  ) {
    const { email, id } = req.user as User;

    return { email, id, ...createReportDto };
  }
}
