import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto, UpdateReportDto } from './report.dto';
import { UtilFunction } from 'src/util/util.resOption';

@Injectable()
export class ReportRepository {
  constructor(
    private prisma: PrismaService,
    private util: UtilFunction,
  ) {}

  async createReport(createReportDto: CreateReportDto, email: string) {
    const { isbn13, ...data } = createReportDto;

    const newReport = await this.prisma.report.create({
      data: {
        ...data,
        book: {
          connect: {
            isbn13,
          },
        },
        user: {
          connect: {
            email,
          },
        },
      },
      ...this.util.reportResOption(),
    });

    return newReport;
  }

  async findReportById(reportId: string) {
    return this.prisma.report.findUnique({
      where: {
        id: reportId,
      },
      ...this.util.reportResOption(),
    });
  }

  async updateReport(updateReportDto: UpdateReportDto, reportId: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: updateReportDto,
    });
  }

  async deleteReport(reportId: string) {
    return this.prisma.report.delete({
      where: {
        id: reportId,
      },
    });
  }
}
