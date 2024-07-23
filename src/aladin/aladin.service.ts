import { Injectable } from '@nestjs/common';
import { AladinRepository } from './aladin.repository';
import { AladinBookListDto, IsbnDto } from './aladin.dto';

@Injectable()
export class AladinService {
  constructor(private aladinRepository: AladinRepository) {}

  // 검색
  async getBookListByKeyWord(aladinBookListDto: AladinBookListDto) {
    const { totalResults, startIndex, itemsPerPage, query, item } =
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

    return {
      totalResults,
      startIndex,
      itemsPerPage,
      query,
      items,
    };
  }

  // 상세 조회
  async getBookDetailByIsbn(isbnDto: IsbnDto) {
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
      subInfo: { subTitle, originalTitle, itemPage, ...packing },
    };
  }
}
