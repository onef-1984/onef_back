import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { Book } from './book.schema';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async findBookById(bookId: string) {
    const res = await this.bookRepository.findBookById(bookId);

    if (!res) throw new NotFoundException('존재하지 않는 책입니다');

    return res;
  }

  async createBook(bookInput: Book) {
    const findBook = await this.bookRepository.findBookById(bookInput.isbn13);

    if (findBook) {
      return findBook;
    } else {
      return await this.bookRepository.createBook(bookInput);
    }
  }
}
