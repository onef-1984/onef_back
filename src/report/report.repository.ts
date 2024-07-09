import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto, UpdateReportDto } from './report.dto';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async createReport(createReportDto: CreateReportDto, email: string) {
    const { isbn, ...data } = createReportDto;

    const newReport = await this.prisma.report.create({
      data: {
        ...data,
        book: {
          connect: {
            isbn,
          },
        },
        user: {
          connect: {
            email,
          },
        },
      },
    });

    return newReport;
  }

  async findReportById(reportId: string) {
    return this.prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        book: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  }

  async updateReport(updateReportDto: UpdateReportDto, reportId: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: { ...updateReportDto },
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
