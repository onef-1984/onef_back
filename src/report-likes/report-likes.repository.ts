import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportLikesRepository {
  constructor(private prisma: PrismaService) {}

  async isUserLikedReport(reportId: string, userId: string) {
    return await this.prisma.reportLike.findUnique({
      where: {
        userId_reportId: { userId, reportId },
      },
    });
  }

  async postReportLike(reportId: string, userId: string) {
    return await this.prisma.reportLike.create({
      data: {
        report: {
          connect: {
            id: reportId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteReportLike(reportId: string, userId: string) {
    return await this.prisma.reportLike.delete({
      where: {
        userId_reportId: { userId, reportId },
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
        book: {
          include: {
            subInfo: true,
          },
        },
        user: true,
        _count: {
          select: { userLiked: true },
        },
      },
    });
  }
}
