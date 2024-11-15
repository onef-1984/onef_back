import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from './book.schema';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async findBookById(bookId: string) {
    return this.prisma.book.findUnique({
      where: { isbn13: bookId },
      include: { subInfo: true },
    });
  }

  async createBook({ subInfo, ...restData }: Book) {
    return this.prisma.book.create({
      data: {
        ...restData,
        subInfo: {
          create: { ...subInfo },
        },
      },
      include: { subInfo: true },
    });
  }
}
