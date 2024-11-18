import {
  Field,
  InputType,
  PartialType,
  OmitType,
  ObjectType,
  Int,
  IntersectionType,
  registerEnumType,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Book } from 'src/book/book.schema';
import { User } from 'src/user/user.dto';
import { HasNext } from 'src/util/util.schema';

@InputType()
export class ReportInput {
  @IsNotEmpty()
  @IsISBN()
  @Field()
  isbn13: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;

  @IsOptional()
  @Field(() => [String])
  tags: string[];
}

export enum OrderBy {
  createdAt = 'createdAt',
  userLiked = 'userLiked',
}

export enum SearchType {
  report = 'report',
  book = 'book',
  tag = 'tag',
  user = 'user',
  userLiked = 'userLiked',
}

registerEnumType(SearchType, {
  name: 'SearchType',
  description: 'The search type of the report',
});

registerEnumType(OrderBy, {
  name: 'OrderBy',
  description: 'The order by of the report',
});

@InputType()
export class ReportUpdateInput extends OmitType(PartialType(ReportInput), [
  'isbn13',
] as const) {}

@InputType()
export class SearchReportInput {
  // @IsNotEmpty()
  @IsString()
  @Field()
  keyword: string;

  @IsNotEmpty()
  @IsIn(['createdAt', 'userLiked'])
  @Field(() => OrderBy)
  orderBy: OrderBy;

  @IsNotEmpty()
  @IsIn(['report', 'book', 'tag', 'user', 'userLiked'])
  @Field(() => SearchType)
  searchType: SearchType;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  take: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  skip: number;
}

@ObjectType()
export class Count {
  @Field(() => Int)
  userLiked: number;
}

@ObjectType()
export class Report {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Count)
  _count: Count;

  @Field(() => Book)
  book: Book;

  @ApiProperty()
  @Field(() => User)
  user: User;
}

@ObjectType()
export class ReportList {
  @Field(() => [Report])
  items: Report[];
}

@ObjectType()
export class ReportListWithHasNext extends IntersectionType(
  HasNext,
  ReportList,
) {}
