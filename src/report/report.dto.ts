import { OmitType } from '@nestjs/mapped-types';
import {
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsISBN()
  isbn13: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  tags: string[];
}

export class SearchReportDto {
  // @IsNotEmpty()
  @IsString()
  keyword: string;

  @IsNotEmpty()
  @IsString()
  orderBy: 'createdAt' | 'userLiked';

  @IsNotEmpty()
  @IsNumber()
  take: number;

  @IsNotEmpty()
  @IsNumber()
  skip: number;
}

export class UpdateReportDto extends OmitType(CreateReportDto, [
  'isbn13',
] as const) {}
