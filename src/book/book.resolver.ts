import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from './book.schema';

@Resolver()
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => Book)
  async getBook(@Args('isbn13') isbn13: string) {
    return this.bookService.findBookById(isbn13);
  }

  @Mutation(() => Book)
  async createBook(@Args('bookInput') bookInput: Book) {
    return this.bookService.createBook(bookInput);
  }
}
