import { Injectable } from '@nestjs/common';
import { ReportLikesRepository } from './report-likes.repository';

@Injectable()
export class ReportLikesService {
  constructor(private reportLikesRepository: ReportLikesRepository) {}

  async checkReportLike(reportId: string, userId: string) {
    const report = await this.reportLikesRepository.findReportLikesById(
      reportId,
      userId,
    );

    return !!report;
  }

  async postReportLike(reportId: string, userId: string) {
    return await this.reportLikesRepository.postReportLike(reportId, userId);
  }

  async deleteReportLike(reportId: string, userId: string) {
    return await this.reportLikesRepository.deleteReportLike(reportId, userId);
  }

  async getTopLikedReports() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const likedReportIdList =
      await this.reportLikesRepository.getMostLikedReport(oneWeekAgo, 8);

    const topReportIds = likedReportIdList.map((like) => like.reportId);

    const reportList =
      await this.reportLikesRepository.getReportsByReportIds(topReportIds);

    const order = likedReportIdList.map(({ reportId, _count }) => {
      const report = reportList.find(({ id }) => id === reportId);

      report._count.userLiked = _count.userId;

      return report;
    });

    return order;
  }
}
