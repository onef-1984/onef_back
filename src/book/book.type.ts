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
