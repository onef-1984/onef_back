import { Injectable } from '@nestjs/common';
import { ChangeProfileDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async changeProfile(changeProfileDto: ChangeProfileDto, userId: string) {
    const newUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...changeProfileDto,
      },
    });

    return newUser;
  }

  async changePassword(password: string, userId: string) {
    const newUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password,
      },
    });

    return newUser;
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
  }

  async getUserReports(userId: string) {
    const reports = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        report: {
          orderBy: { createdAt: 'desc' },
          include: {
            book: {
              select: {
                title: true,
                author: true,
                description: true,
              },
            },
          },
          omit: { isbn13: true, userId: true, createdAt: true, content: true },
        },
      },
    });

    return reports;
  }
}
