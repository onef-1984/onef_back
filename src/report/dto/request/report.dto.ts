import { ApiProperty, OmitType } from '@nestjs/swagger';
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
  @ApiProperty()
  isbn13: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsOptional()
  @ApiProperty()
  tags: string[];
}

export class SearchReportDto {
  // @IsNotEmpty()
  @IsString()
  @ApiProperty()
  keyword: string;

  @IsNotEmpty()
  @IsIn(['createdAt', 'userLiked'])
  @ApiProperty({ enum: ['createdAt', 'userLiked'] })
  orderBy: 'createdAt' | 'userLiked';

  @IsNotEmpty()
  @IsIn(['report', 'book', 'tag', 'user', 'userLiked'])
  @ApiProperty({
    enum: ['report', 'book', 'tag', 'user', 'userLiked'],
  })
  searchType: 'report' | 'book' | 'tag' | 'user' | 'userLiked';

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12' })
  take: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0' })
  skip: string;
}

export class UpdateReportDto extends OmitType(CreateReportDto, [
  'isbn13',
] as const) {}