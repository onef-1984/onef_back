import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './book.dto';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async createBook({ subInfo, ...restData }: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        ...restData,
        subInfo: {
          create: { ...subInfo },
        },
      },
      select: { isbn13: true },
    });
  }

  async findBookById(bookId: string) {
    return this.prisma.book.findUnique({
      where: { isbn13: bookId },
      include: { subInfo: { omit: { id: true } } },
      omit: { subInfoId: true, createdAt: true, updatedAt: true },
    });
  }
}
