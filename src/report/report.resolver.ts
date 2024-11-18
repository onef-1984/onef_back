import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReportService } from './report.service';
import {
  ReportInput,
  Report,
  SearchReportInput,
  ReportListWithHasNext,
  ReportUpdateInput,
} from './report.schema';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Resolver()
export class ReportResolver {
  constructor(private reportService: ReportService) {}

  @Query(() => ReportListWithHasNext)
  async getReportListBySearch(@Args('query') query: SearchReportInput) {
    return this.reportService.getReportListBySearch(query);
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
  async updateReport(
    @Args('reportUpdateInput') reportUpdateInput: ReportUpdateInput,
    @Args('reportId') reportId: string,
    @Context('req') { user: { id: userId } }: { user: User },
  ) {
    const isOwner = await this.reportService.checkIsOwner(reportId, userId);

    if (isOwner)
      return this.reportService.updateReport(reportUpdateInput, reportId);
    else
      throw new UnauthorizedException({
        message: '수정 권한이 없습니다',
      });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Report)
  async deleteReport(
    @Args('reportId') reportId: string,
    @Context('req') { user: { id: userId } }: { user: User },
  ) {
    const isOwner = await this.reportService.checkIsOwner(reportId, userId);

    if (isOwner) return this.reportService.deleteReport(reportId);
    else
      throw new UnauthorizedException({
        message: '삭제 권한이 없습니다',
      });
  }
}
