import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  createUser(signUpDto: SignUpDto) {
    return this.prisma.user.create({
      data: signUpDto,
      select: { id: true, email: true, nickname: true },
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, nickname: true, password: true },
    });

    if (!user) throw new NotFoundException('해당하는 유저가 없습니다');

    return user;
  }
}
