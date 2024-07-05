import { Injectable } from '@nestjs/common';
import { AladinRepository } from './aladin.repository';
import { AladinBookListDto, IsbnDto } from './aladin.dto';

@Injectable()
export class AladinService {
  constructor(private aladinRepository: AladinRepository) {}

  async getBookListByKeyWord(aladinBookListDto: AladinBookListDto) {
    const { totalResults, startIndex, itemsPerPage, query, item } =
      await this.aladinRepository.getBookListByKeyWord(aladinBookListDto);

    const items = item.map((book) => {
      const { isbn13, title, author, cover, description } = book;

      return { title, author, cover, description, isbn13 };
    });

    return { totalResults, startIndex, itemsPerPage, query, items };
  }

  async getBookDetailByIsbn(isbnDto: IsbnDto) {
    const { item } = await this.aladinRepository.getBookDetailByIsbn(isbnDto);

    const result = item[0];

    const {
      title,
      author,
      description,
      cover,
      subInfo,
      pubDate,
      publisher,
      priceStandard,
      isbn13,
    } = result;

    return {
      title,
      author,
      description,
      cover,
      itemPage: subInfo.itemPage,
      pubDate,
      publisher,
      priceStandard,
      isbn13,
    };
  }
}
