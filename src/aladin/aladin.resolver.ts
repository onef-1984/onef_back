import { Args, Query, Resolver } from '@nestjs/graphql';
import { Book } from 'src/book/book.schema';
import { AladinService } from './aladin.service';
import { AladinSearchInput, AladinSearchResult } from './aladin.schema';

@Resolver(() => Book)
export class AladinResolver {
  constructor(private aladinService: AladinService) {}

  @Query(() => AladinSearchResult)
  getBookList(@Args('aladinSearchInput') args: AladinSearchInput) {
    return this.aladinService.getBookListByKeyWord(args);
  }

  @Query(() => Book)
  getBookDetail(@Args('isbn13') isbn13: string) {
    return this.aladinService.getBookDetailByIsbn(isbn13);
  }
}
