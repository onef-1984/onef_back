import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AladinBookListDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '검색어' })
  keyword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '검색 결과 시작 위치' })
  skip: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '검색 결과 수' })
  take: string;
}

export class IsbnDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'isbn' })
  isbn: string;
}
