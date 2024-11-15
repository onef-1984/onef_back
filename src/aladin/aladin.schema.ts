import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class AladinSearchInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  skip: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  take: string;
}

@ObjectType()
class Item {
  @Field()
  @IsString()
  isbn13: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  author: string;

  @Field()
  @IsString()
  pubDate: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  cover: string;

  @Field(() => Int)
  @IsNumber()
  categoryId: number;

  @Field()
  @IsString()
  categoryName: string;

  @Field()
  @IsString()
  publisher: string;

  @Field(() => Int)
  @IsNumber()
  customerReviewRank: number;
}

@ObjectType()
export class AladinSearchResult {
  @Field()
  hasNext: boolean;

  @Field(() => [Item])
  items: Array<Item>;
}
