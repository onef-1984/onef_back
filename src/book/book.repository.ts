import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto, SubInfo } from './book.dto';
import { IsbnDto } from 'src/aladin/aladin.dto';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async createBook(book: Omit<CreateBookDto, 'subInfo'>, subInfo: SubInfo) {
    return this.prisma.book.create({
      data: {
        ...book,
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
      include: { subInfo: true },
      omit: { subInfoId: true },
    });
  }
}
