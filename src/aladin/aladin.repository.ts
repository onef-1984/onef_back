import { Injectable } from '@nestjs/common';
import { GetBookList } from './aladin.type';
import { AladinSearchInput } from './aladin.schema';
import { Book } from 'src/book/book.schema';

@Injectable()
export class AladinRepository {
  async getBookListByKeyWord({
    keyword,
    skip,
    take,
  }: AladinSearchInput): Promise<GetBookList> {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbwpfekdml1340001&Query=${keyword}&QueryType=Keyword&MaxResults=${take}&start=${skip}&SearchTarget=Book&cover=big&output=js&Version=20131101`,
    );

    const data = await result.json();

    return data;
  }

  async getBookDetailByIsbn(isbn13: string): Promise<{ item: Book }> {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbwpfekdml1340001&itemIdType=ISBN&cover=big&ItemId=${isbn13}&output=js&Version=20131101&OptResult=packing`,
    );

    const data = await result.json();

    return data;
  }
}
