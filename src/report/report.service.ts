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
    function getWhere(searchType: string) {
      switch (searchType) {
        case 'report':
          return {
            OR: [
              { title: { contains: query.keyword } },
              { content: { contains: query.keyword } },
              { book: { title: { contains: query.keyword } } },
              { book: { author: { contains: query.keyword } } },
            ],
          };

        case 'book':
          return {
            isbn13: query.keyword,
          };

        case 'user':
          return { userId: query.keyword };

        case 'userLiked':
          return {
            userLiked: {
              some: {
                userId: query.keyword,
              },
            },
          };

        // case 'user':
        //   return {
        //     user: { nickname: { contains: where.nickname } },
        //   };

        case 'tag':
          return { tags: { has: query.keyword } };
      }
    }

    const where = getWhere(query.searchType);

    const totalResults =
      await this.reportRepository.getReportListBySearch_Count(where);
    const items = await this.reportRepository.getReportListBySearch(
      query,
      where,
    );

    const hasNext = totalResults > Number(query.skip) + Number(query.take);

    return { hasNext, items };
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
