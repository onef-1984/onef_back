import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  tags: string[];

  @IsNotEmpty()
  @IsEnum(['SHORT', 'MIDDLE', 'LONG'])
  reportType: 'SHORT' | 'MIDDLE' | 'LONG';
}

export class UpdateReportDto extends OmitType(PartialType(CreateReportDto), [
  'isbn',
] as const) {}
