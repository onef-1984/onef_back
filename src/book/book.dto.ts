import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';

export class SubInfo {
  @IsString()
  subTitle: string;

  @IsString()
  originalTitle: string;

  @IsNumber()
  itemPage: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  sizeDepth: number;

  @IsNumber()
  sizeHeight: number;

  @IsNumber()
  sizeWidth: number;
}

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  isbn13: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cover: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  pubDate: string;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  @IsNumber()
  priceStandard: number;

  @IsNotEmpty()
  @IsNumber()
  customerReviewRank: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubInfo)
  subInfo: SubInfo;
}

export class FindBookDto extends PickType(CreateBookDto, ['isbn13']) {}
