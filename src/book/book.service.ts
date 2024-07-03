import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './book.dto';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(createBookDto: CreateBookDto) {
    return this.bookRepository.createBook(createBookDto);
  }

  async findBookById(bookId: string) {
    return this.bookRepository.findBookById(bookId);
  }
}
