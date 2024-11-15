import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './book.dto';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(createBookDto: CreateBookDto) {
    const findBook = await this.bookRepository.findBookById(
      createBookDto.isbn13,
    );

    if (findBook) {
      return { isbn13: createBookDto.isbn13 };
    } else {
      const { isbn13 } = await this.bookRepository.createBook(createBookDto);
      return { isbn13 };
    }
  }

  async findBookById(bookId: string) {
    const res = await this.bookRepository.findBookById(bookId);

    if (!res) throw new NotFoundException('존재하지 않는 책입니다');

    return res;
  }
}
