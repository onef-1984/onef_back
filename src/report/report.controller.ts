import { Body, Controller, Req } from '@nestjs/common';
import { CreateReportDto } from './report.dto';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('report')
export class ReportController {
  constructor() {}

  // 가드로 유저 확인하기
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Req() req: Request,
  ) {
    const user: User = req['user'];

    return user;
  }
}
