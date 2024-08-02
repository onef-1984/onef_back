import { Injectable } from '@nestjs/common';
import { ChangeNicknameDto, ChangeProfileImageDto } from 'src/auth/auth.dto';

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

  async changeProfileImage(
    changeProfileImageDto: ChangeProfileImageDto,
    userId: string,
  ) {
    const newUser = await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: changeProfileImageDto.profileImage },
    });

    return newUser;
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, profileImage: true },
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
