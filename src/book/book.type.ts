import { SubInfo } from '@prisma/client';

export type GetBookList = {
  query: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  item: Array<Item>;
};

export type Item = {
  isbn13: string;
  title: string;
  author: string;
  pubDate: string;
  description: string;
  cover: string;
  categoryId: number;
  categoryName: string;
  publisher: string;
  priceStandard: number;
  customerReviewRank: number;
};

export type AladinBook = {
  item: Array<
    Item & {
      subInfo: Pick<SubInfo, 'subTitle' | 'originalTitle' | 'itemPage'> & {
        packing: Omit<SubInfo, 'subTitle' | 'originalTitle' | 'itemPage'>;
      };
    }
  >;
};
