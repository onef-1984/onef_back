import { Injectable } from '@nestjs/common';
import { AladinBook } from './book.type';

@Injectable()
export class BookHelper {
  transformAladinDataToBookData({ item }: AladinBook) {
    const {
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
      subInfo,
    } = item[0];

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
}
