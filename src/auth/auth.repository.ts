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
      omit: { createdAt: true, updatedAt: true, password: true },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, nickname: true, password: true },
    });
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, nickname: true, password: true },
    });
  }
}
