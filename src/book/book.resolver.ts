import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { BookService } from './book.service';
import { BookSearchInput, BookSearchResult, Book } from './book.schema';

@Resolver()
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => Book)
  async getBook(@Args('isbn13') isbn13: string) {
    return this.bookService.getBookByIsbn(isbn13);
  }

  @Query(() => BookSearchResult)
  getBookList(@Args('bookSearchInput') args: BookSearchInput) {
    return this.bookService.getBookListByKeyWord(args);
  }

  @Mutation(() => Book)
  async createBook(@Args('isbn13') isbn13: string) {
    return this.bookService.createBook(isbn13);
  }
}
