import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto } from './report.dto';

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async createReport(createReportDto: CreateReportDto, email: string) {
    return this.reportRepository.createReport(createReportDto, email);
  }

  async getReport(reportId: string) {
    return this.reportRepository.findReportById(reportId);
  }

  async checkIsOwner(reportId: string, userEmail: string) {
    const targetReport = await this.reportRepository.findReportById(reportId);

    if (targetReport.user.email !== userEmail) return false;
    else return true;
  }

  async deleteReport(reportId: string) {
    return this.reportRepository.deleteReport(reportId);
  }
}
