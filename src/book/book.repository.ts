import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book, BookSearchInput } from './book.schema';
import { GetBookList, Item } from './book.type';
import { SubInfo } from '@prisma/client';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async getBookByIsbn(isbn13: string) {
    return this.prisma.book.findUnique({
      where: { isbn13 },
      include: { subInfo: true },
    });
  }

  async createBook({ subInfo, ...restData }: Book) {
    return this.prisma.book.create({
      data: {
        ...restData,
        subInfo: {
          create: { ...subInfo },
        },
      },
      include: { subInfo: true },
    });
  }

  async getBookFromAladin(
    isbn13: string,
  ): Promise<{ item: Item & { subInfo: { packing: SubInfo } } }> {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbwpfekdml1340001&itemIdType=ISBN&cover=big&ItemId=${isbn13}&output=js&Version=20131101&OptResult=packing`,
    );

    const data = await result.json();

    return data;
  }

  async getBookListFromAladin({
    keyword,
    skip,
    take,
  }: BookSearchInput): Promise<GetBookList> {
    const result = await fetch(
      `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbwpfekdml1340001&Query=${keyword}&QueryType=Keyword&MaxResults=${take}&start=${skip}&SearchTarget=Book&cover=big&output=js&Version=20131101`,
    );

    const data = await result.json();

    return data;
  }
}
