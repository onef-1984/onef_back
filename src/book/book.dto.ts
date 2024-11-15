import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class SubInfo {
  @Field()
  @IsString()
  @ApiProperty({ description: '부제목' })
  subTitle: string;

  @Field()
  @IsString()
  @ApiProperty({ description: '원제목' })
  originalTitle: string;

  @Field()
  @IsNumber()
  @ApiProperty({ description: '페이지 수' })
  itemPage: number;

  @Field()
  @IsNumber()
  @ApiProperty({ description: '무게' })
  weight: number;

  @Field()
  @IsNumber()
  @ApiProperty({ description: '두께' })
  sizeDepth: number;

  @Field()
  @IsNumber()
  @ApiProperty({ description: '높이' })
  sizeHeight: number;

  @Field()
  @IsNumber()
  @ApiProperty({ description: '너비' })
  sizeWidth: number;
}

@ObjectType()
export class CreateBookDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'isbn13' })
  isbn13: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '제목' })
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '저자' })
  author: string;

  @Field()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '설명' })
  description: string;

  @Field()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '표지' })
  cover: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '카테고리 이름' })
  categoryName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '출판일' })
  pubDate: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '출판사' })
  publisher: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '정가' })
  priceStandard: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '구매자 리뷰' })
  customerReviewRank: number;

  @Field(() => [SubInfo])
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubInfo)
  @ApiProperty({ description: '부가 정보' })
  subInfo: SubInfo;
}

@ObjectType()
export class Book extends CreateBookDto {}

export class FindBookDto extends PickType(CreateBookDto, ['isbn13']) {}
