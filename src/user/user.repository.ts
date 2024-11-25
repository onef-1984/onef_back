import { Injectable } from '@nestjs/common';
import { ChangeProfileInput } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async changeProfile(changeProfileDto: ChangeProfileInput, userId: string) {
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
