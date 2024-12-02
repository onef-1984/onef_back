import { Test, TestingModule } from '@nestjs/testing';
import { BookResolver } from '../book.resolver';
import { BookService } from '../book.service';
import { Book } from '../book.schema';
import { NotFoundException } from '@nestjs/common';

describe('BookResolver', () => {
  let resolver: BookResolver;
  let service: BookService;
  const book: Book = {
    isbn13: '1234567890123',
    title: '테스트 도서',
    author: '홍길동',
    description: '테스트 설명',
    cover: 'cover_url',
    pubDate: '2024-01-01',
    publisher: '테스트 출판사',
    categoryId: 1,
    categoryName: '테스트 카테고리',
    priceStandard: 20000,
    customerReviewRank: 4.5,
    subInfo: {
      subTitle: '부제목',
      originalTitle: 'Original Title',
      itemPage: 350,
      weight: 500,
      sizeDepth: 20,
      sizeHeight: 30,
      sizeWidth: 25,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookResolver,
        {
          provide: BookService,
          useValue: {
            getBookByIsbn: jest.fn().mockImplementation((isbn13: string) => {
              if (isbn13 === '') throw new NotFoundException();
              return book;
            }),
            getBookListByKeyWord: jest.fn(),
            createBook: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<BookResolver>(BookResolver);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getBook', () => {
    it('should return a book', async () => {
      jest.spyOn(service, 'getBookByIsbn').mockResolvedValue(book);

      expect(await resolver.getBook('1234567890123')).toEqual(book);
      expect(service.getBookByIsbn).toHaveBeenCalledWith('1234567890123');
    });

    it('should throw an error when isbn13 is not provided', async () => {
      try {
        await resolver.getBook('');
      } catch (e) {
        expect(e).toStrictEqual(new NotFoundException());
      }
    });
  });

  describe('getBookList', () => {
    it('should return a book list', async () => {
      const bookSearchInput = {
        keyword: '테스트',
        skip: 12,
        take: 0,
      };
      jest
        .spyOn(service, 'getBookListByKeyWord')
        .mockResolvedValue({ hasNext: true, items: [book] });

      expect(await resolver.getBookList(bookSearchInput)).toEqual({
        hasNext: true,
        items: [book],
      });
    });
  });
});
