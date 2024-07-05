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
  bookId: string;

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
