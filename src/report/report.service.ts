import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import {
  CreateReportDto,
  SearchReportDto,
  UpdateReportDto,
} from './report.dto';

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async createReport(createReportDto: CreateReportDto, email: string) {
    return this.reportRepository.createReport(createReportDto, email);
  }

  async getReport(reportId: string) {
    const report = await this.reportRepository.findReportById(reportId);

    if (!report) throw new NotFoundException('Report not found');

    return report;
  }

  async getReportListBySearch(query: SearchReportDto) {
    const totalResults =
      await this.reportRepository.getReportListBySearch_Count(query);
    const items = await this.reportRepository.getReportListBySearch(query);

    const hasNext = totalResults > Number(query.skip) * Number(query.take);

    return { hasNext, items };
  }

  async getTopLikedReports() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const likedReportIdList = await this.reportRepository.getMostLikedReport(
      oneWeekAgo,
      8,
    );

    const topReportIds = likedReportIdList.map((like) => like.reportId);

    const reportList =
      await this.reportRepository.getReportsByReportIds(topReportIds);

    const order = likedReportIdList.map(({ reportId, _count }) => {
      const report = reportList.find(({ id }) => id === reportId);

      report._count.userLiked = _count.userId;

      return report;
    });

    return order;
  }

  async checkIsOwner(reportId: string, userId: string) {
    const targetReport = await this.reportRepository.findReportById(reportId);

    if (targetReport?.user.id !== userId) return false;
    else return true;
  }

  async deleteReport(reportId: string) {
    return await this.reportRepository.deleteReport(reportId);
  }

  async updateReport(updateReportDto: UpdateReportDto, reportId: string) {
    return this.reportRepository.updateReport(updateReportDto, reportId);
  }
}
