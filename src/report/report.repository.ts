import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateReportDto,
  SearchReportDto,
  UpdateReportDto,
} from './report.dto';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

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
      select: { id: true },
    });

    return newReport;
  }

  async getReportList({ orderBy, skip, take, keyword }: SearchReportDto) {
    return await this.prisma.report.findMany({
      include: {
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
      skip: Number(skip),
      take: Number(take),
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
    });
  }

  async getMostLikedReport(gte: Date, take: number) {
    return await this.prisma.reportLike.groupBy({
      by: ['reportId'],
      where: {
        createdAt: {
          gte,
        },
      },
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      _count: {
        userId: true,
      },
      take,
    });
  }

  async getReportsByReportIds(reportIds: string[]) {
    return await this.prisma.report.findMany({
      where: { id: { in: reportIds } },
      include: {
        _count: {
          select: { userLiked: true },
        },
      },
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
        book: {
          include: { subInfo: { select: { itemPage: true } } },
          omit: {
            subInfoId: true,
            categoryId: true,
            pubDate: true,
            priceStandard: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        user: {
          select: { id: true, nickname: true },
        },
        _count: {
          select: { userLiked: true },
        },
      },
      omit: { isbn13: true, userId: true },
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
