import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './report.dto';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async createReport(createReportDto: CreateReportDto, email: string) {
    const { bookId, ...data } = createReportDto;

    const newReport = await this.prisma.report.create({
      data: {
        ...data,
        book: {
          connect: {
            id: bookId,
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

  async getReport(reportId: string) {
    return this.prisma.report.findUnique({
      where: {
        id: reportId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            page: true,
          },
        },
      },
    });
  }
}
