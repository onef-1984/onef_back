import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './book.dto';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(createBookDto: CreateBookDto) {
    const { subInfo, ...book } = createBookDto;

    const findBook = await this.bookRepository.findBookById(book.isbn13);

    if (findBook) {
      return { isbn13: book.isbn13 };
    } else {
      const { isbn13 } = await this.bookRepository.createBook(book, subInfo);
      return { isbn13 };
    }
  }

  async findBookById(bookId: string) {
    const res = await this.bookRepository.findBookById(bookId);

    if (!res) throw new NotFoundException('존재하지 않는 책입니다');

    return res;
  }
}
