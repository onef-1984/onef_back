import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './book.dto';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async createBook(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  async findBookById(bookId: string) {
    return this.prisma.book.findUnique({
      where: { id: bookId },
    });
  }
}
