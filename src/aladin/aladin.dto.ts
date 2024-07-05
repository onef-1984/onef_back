import { IsNotEmpty, IsString } from 'class-validator';

export class AladinBookListDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;

  @IsNotEmpty()
  @IsString()
  skip: string;

  @IsNotEmpty()
  @IsString()
  take: string;
}

export class IsbnDto {
  @IsNotEmpty()
  @IsString()
  isbn: string;
}
