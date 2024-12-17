import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookSearchInput } from './book.schema';
import { BookHelper } from './book.helper';

@Injectable()
export class BookService {
  constructor(
    private bookHelper: BookHelper,
    private bookRepository: BookRepository,
  ) {}

  async createBook(isbn13: string) {
    // 이미 존재하는 책이라면 DB에서 찾아서 보내줌
    const findBook = await this.bookRepository.getBookByIsbn(isbn13);

    if (findBook) return findBook;
    else {
      const newBook = await this.getBookByIsbn(isbn13);

      return await this.bookRepository.createBook(newBook);
    }
  }

  // 상세 조회
  async getBookByIsbn(isbn13: string) {
    // 이미 존재하는 책이라면 DB에서 조줌해서 보내줌
    const res = await this.bookRepository.getBookByIsbn(isbn13);

    if (res) return res;

    // 존재하지 않는 책이라면 알라딘 API에서 조회해서 보내줌
    const item = await this.bookRepository.getBookFromAladin(isbn13);

    // formatting 된 데이터를 반환
    return this.bookHelper.transformAladinDataToBookData(item);
  }

  // 검색
  async getBookListByKeyWord(bookSearchInput: BookSearchInput) {
    const { totalResults, startIndex, itemsPerPage, item } =
      await this.bookRepository.getBookListFromAladin(bookSearchInput);

    const hasNext = totalResults > startIndex * itemsPerPage;

    return {
      hasNext,
      items: item,
    };
  }
}
