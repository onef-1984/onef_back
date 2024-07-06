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
          select: {
            id: true,
            title: true,
            content: true,
            reportType: true,
            tags: true,
            book: true,
          },
        },
      },
    });

    return reports;
  }
}
