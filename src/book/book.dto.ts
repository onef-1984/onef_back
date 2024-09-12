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

export class SubInfo {
  @IsString()
  @ApiProperty({ description: '부제목' })
  subTitle: string;

  @IsString()
  @ApiProperty({ description: '원제목' })
  originalTitle: string;

  @IsNumber()
  @ApiProperty({ description: '페이지 수' })
  itemPage: number;

  @IsNumber()
  @ApiProperty({ description: '무게' })
  weight: number;

  @IsNumber()
  @ApiProperty({ description: '두께' })
  sizeDepth: number;

  @IsNumber()
  @ApiProperty({ description: '높이' })
  sizeHeight: number;

  @IsNumber()
  @ApiProperty({ description: '너비' })
  sizeWidth: number;
}

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'isbn13' })
  isbn13: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '제목' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '저자' })
  author: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '설명' })
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '표지' })
  cover: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '카테고리 이름' })
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '출판일' })
  pubDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '출판사' })
  publisher: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '정가' })
  priceStandard: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '구매자 리뷰' })
  customerReviewRank: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubInfo)
  @ApiProperty({ description: '부가 정보' })
  subInfo: SubInfo;
}

export class FindBookDto extends PickType(CreateBookDto, ['isbn13']) {}
