import { Injectable } from '@nestjs/common';
import { AladinRepository } from './aladin.repository';
import { AladinBookListDto, IsbnDto } from './aladin.dto';
import { BookRepository } from 'src/book/book.repository';

const omit: <T extends Record<string, any>, K extends Array<keyof T>>(
  obj: T,
  keys: K,
) => T = (obj, keys) => {
  for (const key of keys) {
    delete obj[key];
  }

  return obj;
};

export default omit;

@Injectable()
export class AladinService {
  constructor(
    private aladinRepository: AladinRepository,
    private bookRepository: BookRepository,
  ) {}

  // 검색
  async getBookListByKeyWord(aladinBookListDto: AladinBookListDto) {
    const { totalResults, startIndex, itemsPerPage, item } =
      await this.aladinRepository.getBookListByKeyWord(aladinBookListDto);

    // map을 통해 item에서 필요한 데이터만 추출
    const items = item.map((book) => {
      const {
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
      } = book;

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
        customerReviewRank,
      };
    });

    const hasNext = totalResults > startIndex + itemsPerPage;

    return {
      hasNext,
      items,
    };
  }

  // 상세 조회
  async getBookDetailByIsbn(isbnDto: IsbnDto) {
    // 이미 존재하는 책이라면 DB에서 조줌해서 보내줌
    const res = await this.bookRepository.findBookById(isbnDto.isbn);

    if (res) {
      return res;
    }

    // 존재하지 않는 책이라면 알라딘 API에서 조회해서 보내줌
    const { item } = await this.aladinRepository.getBookDetailByIsbn(isbnDto);

    const result = item[0];

    const {
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
      subInfo: { subTitle, originalTitle, itemPage, packing },
    } = result;

    return {
      isbn13,
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
        subTitle,
        originalTitle,
        itemPage,
        ...omit(packing, ['styleDesc']),
      },
    };
  }
}
