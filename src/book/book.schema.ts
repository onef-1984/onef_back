import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { HasNext } from 'src/util/util.schema';

@InputType('SubInfoInput')
@ObjectType('SubInfoObject')
class SubInfo {
  @Field()
  @IsString()
  subTitle: string;

  @Field()
  @IsString()
  originalTitle: string;

  @Field()
  @IsNumber()
  itemPage: number;

  @Field()
  @IsNumber()
  weight: number;

  @Field()
  @IsNumber()
  sizeDepth: number;

  @Field()
  @IsNumber()
  sizeHeight: number;

  @Field()
  @IsNumber()
  sizeWidth: number;
}

@InputType('BookInput', { isAbstract: true })
@ObjectType('BookObject', { isAbstract: true })
export class Book {
  @Field()
  @IsNotEmpty()
  @IsString()
  isbn13: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  author: string;

  @Field()
  @IsOptional()
  @IsString()
  description: string;

  @Field()
  @IsOptional()
  @IsString()
  cover: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  pubDate: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  publisher: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  priceStandard: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  customerReviewRank: number;

  @Field(() => SubInfo)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubInfo)
  subInfo: SubInfo;
}

@ObjectType()
export class Item {
  @Field()
  @IsNotEmpty()
  @IsString()
  isbn13: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  author: string;

  @Field()
  @IsOptional()
  @IsString()
  description: string;

  @Field()
  @IsOptional()
  @IsString()
  cover: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  pubDate: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  publisher: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  priceStandard: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  customerReviewRank: number;
}

@InputType()
export class BookSearchInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  skip: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  take: number;
}

@ObjectType()
export class BookSearchResult extends HasNext {
  @Field(() => [Item])
  items: Array<Item>;
}
