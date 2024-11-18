import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ReportInput,
  ReportUpdateInput,
  SearchReportInput,
} from './report.schema';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async createReport(reportInput: ReportInput, email: string) {
    const { isbn13, ...data } = reportInput;

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
      include: {
        book: true,
        user: true,
        _count: {
          select: { userLiked: true },
        },
      },
    });

    return newReport;
  }

  async getReportListBySearch_Count(where: any) {
    return await this.prisma.report.count({
      where,
    });
  }

  async getReportListBySearch(
    { orderBy, skip, take }: SearchReportInput,
    where: any,
  ) {
    return await this.prisma.report.findMany({
      include: {
        book: true,
        user: true,
        _count: {
          select: { userLiked: true },
        },
      },
      orderBy:
        orderBy === 'createdAt'
          ? { createdAt: 'desc' }
          : {
              userLiked: { _count: 'desc' },
            },
      skip,
      take,
      where,
    });
  }

  async getReportLikeCount(id: string) {
    return await this.prisma.report.findUnique({
      where: { id },
      select: {
        _count: {
          select: { userLiked: true },
        },
      },
    });
  }

  async findReportById(reportId: string) {
    return this.prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        book: true,
        user: true,
        _count: {
          select: { userLiked: true },
        },
      },
    });
  }

  async updateReport(reportUpdateInput: ReportUpdateInput, reportId: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: reportUpdateInput,
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
