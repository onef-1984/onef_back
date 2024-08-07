import { OmitType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsISBN,
  IsNotEmpty,
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
  @IsIn(['createdAt', 'userLiked'])
  orderBy: 'createdAt' | 'userLiked';

  @IsNotEmpty()
  @IsIn(['report', 'book', 'tag', 'user'])
  searchType: 'report' | 'book' | 'tag' | 'user';

  @IsNotEmpty()
  @IsString()
  take: string;

  @IsNotEmpty()
  @IsString()
  skip: string;
}

export class UpdateReportDto extends OmitType(CreateReportDto, [
  'isbn13',
] as const) {}
