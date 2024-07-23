import { Injectable } from '@nestjs/common';
import { AladinBookListDto, IsbnDto } from './aladin.dto';
import { GetBookDetail, GetBookList } from './aladin.type';

@Injectable()
export class AladinRepository {
  async getBookListByKeyWord({
    keyword,
    skip,
    take,
  }: AladinBookListDto): Promise<GetBookList> {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbwpfekdml1340001&Query=${keyword}&QueryType=Keyword&MaxResults=${take}&start=${skip}&SearchTarget=Book&cover=big&output=js&Version=20131101`,
    );

    const data = await result.json();

    return data;
  }

  async getBookDetailByIsbn({ isbn }: IsbnDto): Promise<GetBookDetail> {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbwpfekdml1340001&itemIdType=ISBN&cover=big&ItemId=${isbn}&output=js&Version=20131101&OptResult=packing`,
    );

    const data = await result.json();

    return data;
  }
}
