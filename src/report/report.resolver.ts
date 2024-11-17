import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { ReportList } from './dto/response/report.dto';
import { CreateReportDto } from './dto/request/report.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Resolver()
export class ReportResolver {
  constructor(private reportService: ReportService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ReportList)
  async createReport(
    @Args('reportInput') createReportDto: CreateReportDto,
    @Context('req') { user: { email } }: { user: User },
  ) {
    return this.reportService.createReport(createReportDto, email);
  }
}
