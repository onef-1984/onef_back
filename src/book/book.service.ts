import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookSearchInput, Book } from './book.schema';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(bookInput: Book) {
    // 이미 존재하는 책이라면 DB에서 찾아서 보내줌
    const findBook = await this.bookRepository.getBookByIsbn(bookInput.isbn13);

    if (findBook) return findBook;
    else return await this.bookRepository.createBook(bookInput);
  }

  // 상세 조회
  async getBookByIsbn(isbn13: string) {
    // 이미 존재하는 책이라면 DB에서 조줌해서 보내줌
    const res = await this.bookRepository.getBookByIsbn(isbn13);

    if (res) return res;

    // 존재하지 않는 책이라면 알라딘 API에서 조회해서 보내줌
    const { item } = await this.bookRepository.getBookFromAladin(isbn13);

    if (!item) throw new NotFoundException('책을 찾을 수 없습니다.');

    const {
      isbn13: isbn,
      title,
      author,
      description,
      cover,
      categoryId,
      categoryName,
      pubDate,
      publisher,
      priceStandard,
      customerReviewRank,
      subInfo,
    } = item[0];

    // 데이터 구조 변환
    return {
      isbn13: isbn,
      title,
      author,
      description,
      cover,
      categoryId,
      categoryName,
      pubDate,
      publisher,
      priceStandard,
      customerReviewRank,
      subInfo: {
        subTitle: subInfo.subTitle,
        originalTitle: subInfo.originalTitle,
        itemPage: subInfo.itemPage,
        weight: subInfo.packing.weight,
        sizeDepth: subInfo.packing.sizeDepth,
        sizeHeight: subInfo.packing.sizeHeight,
        sizeWidth: subInfo.packing.sizeWidth,
      },
    };
  }

  // 검색
  async getBookListByKeyWord(bookSearchInput: BookSearchInput) {
    const { totalResults, startIndex, itemsPerPage, item } =
      await this.bookRepository.getBookListFromAladin(bookSearchInput);

    // map을 통해 item에서 필요한 데이터만 추출
    const items = item.map(
      ({
        isbn13,
        title,
        author,
        pubDate,
        description,
        cover,
        categoryId,
        categoryName,
        publisher,
        customerReviewRank,
        priceStandard,
      }) => {
        return {
          isbn13,
          title,
          author,
          pubDate,
          description,
          cover,
          categoryId,
          categoryName,
          publisher,
          priceStandard,
          customerReviewRank,
        };
      },
    );

    const hasNext = totalResults > startIndex * itemsPerPage;

    return {
      hasNext,
      items,
    };
  }
}
