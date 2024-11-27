import { Injectable } from '@nestjs/common';
import { ChangeProfileInput } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  changeProfile(changeProfileDto: ChangeProfileInput, userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...changeProfileDto,
      },
    });
  }

  promotionUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: 'ADMIN',
      },
    });
  }

  changePassword(password: string, userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password,
      },
    });
  }

  getUserByNickname(userNickname: string) {
    return this.prisma.user.findUnique({
      where: { nickname: userNickname },
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
