import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

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

@InputType('BookInput')
@ObjectType('BookObject')
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

  @Field()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  pubDate: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  publisher: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  priceStandard: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  customerReviewRank: number;

  @Field(() => SubInfo)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubInfo)
  subInfo: SubInfo;
}
