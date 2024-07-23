import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(signUpDto: SignUpDto) {
    return this.prisma.user.create({
      data: {
        ...signUpDto,
        notify: {
          create: {},
        },
      },
      select: { id: true, email: true, nickname: true },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, nickname: true, password: true },
    });
  }
}
