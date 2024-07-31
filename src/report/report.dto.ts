import { OmitType } from '@nestjs/mapped-types';
import { IsISBN, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class UpdateReportDto extends OmitType(CreateReportDto, [
  'isbn13',
] as const) {}
