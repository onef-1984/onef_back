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
            isbn: bookId,
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
            isbn: true,
            title: true,
            author: true,
            page: true,
          },
        },
      },
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
