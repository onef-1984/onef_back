import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { ReportInput, ReportUpdateInput, Report } from './report.schema';
import {
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Resolver()
export class ReportResolver {
  constructor(private reportService: ReportService) {}

  @Query(() => Report)
  async getReport(@Args('reportId') reportId: string) {
    const res = await this.reportService.getReport(reportId);

    console.log('res', res);

    if (!res) {
      throw new NotFoundException({
        message: '해당 리포트가 없습니다.',
      });
    }

    return res;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Report)
  createReport(
    @Args('reportInput') createReportDto: ReportInput,
    @Context('req') { user: { email } }: { user: User },
  ) {
    return this.reportService.createReport(createReportDto, email);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Report)
  async deleteReport(
    @Args('reportId') reportId: string,
    @Context('req') { user: { id } }: { user: User },
  ) {
    try {
      await this.reportService.checkIsOwner(reportId, id);

      return this.reportService.deleteReport(reportId);
    } catch (e) {
      throw new InternalServerErrorException({
        message: '삭제 실패',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Report)
  async updateReport(
    @Args('reportUpdateInput') reportUpdateInput: ReportUpdateInput,
    @Args('reportId') reportId: string,
    @Context('req') { user: { id } }: { user: User },
  ) {
    try {
      await this.reportService.checkIsOwner(reportId, id);

      return this.reportService.updateReport(reportUpdateInput, reportId);
    } catch (e) {
      throw new InternalServerErrorException({
        message: '삭제 실패',
      });
    }
  }
}
