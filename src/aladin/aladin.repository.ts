import { Injectable } from '@nestjs/common';
import { AladinBookListDto, IsbnDto } from './aladin.dto';

@Injectable()
export class AladinRepository {
  async getBookListByKeyWord({ keyword, skip, take }: AladinBookListDto) {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbwpfekdml1340001&Query=${keyword}&QueryType=Title&MaxResults=${take}&start=${skip}&SearchTarget=Book&cover=big&output=js&Version=20131101`,
    );

    const data = await result.json();

    return data;
  }

  async getBookDetailByIsbn({ isbn }: IsbnDto) {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbwpfekdml1340001&itemIdType=ISBN&cover=big&ItemId=${isbn}&output=js&Version=20131101&OptResult=ebookList,usedList,reviewList`,
    );

    const data = await result.json();

    return data;
  }
}
