import { Injectable } from '@nestjs/common';
import { ChangeNicknameDto } from 'src/auth/auth.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async changeNickname(changeNicknameDto: ChangeNicknameDto, userId: string) {
    const newUser = await this.prisma.user.update({
      where: { id: userId },
      data: { nickname: changeNicknameDto.nickname },
    });

    return newUser;
  }

  async getUserReports(userId: string) {
    const reports = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        report: {
          include: {
            book: {
              include: { subInfo: { omit: { id: true } } },
              omit: { createdAt: true, updatedAt: true, subInfoId: true },
            },
            user: {
              omit: { password: true, createdAt: true, updatedAt: true },
            },
          },
          omit: { isbn13: true, userId: true },
        },
      },
    });

    return reports;
  }
}
