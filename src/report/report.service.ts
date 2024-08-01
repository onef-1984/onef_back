import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto, UpdateReportDto } from './report.dto';

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
