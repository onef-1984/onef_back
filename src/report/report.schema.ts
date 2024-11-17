import {
  Field,
  InputType,
  PartialType,
  OmitType,
  ObjectType,
  Int,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Book } from 'src/book/book.schema';
import { User } from 'src/user/user.dto';

@InputType()
export class ReportInput {
  @IsNotEmpty()
  @IsISBN()
  @Field()
  isbn13: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  tags: string[];
}

@InputType()
export class ReportUpdateInput extends OmitType(PartialType(ReportInput), [
  'isbn13',
] as const) {}

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

@ObjectType()
export class Count {
  @Field(() => Int)
  userLiked: number;
}

@ObjectType()
export class Report {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Count)
  _count: Count;

  @Field(() => Book)
  book: Book;

  @ApiProperty()
  @Field(() => User)
  user: User;
}

export class ReportListResponseDto {
  @ApiProperty()
  hasNext: boolean;

  @ApiProperty({ type: [Report] })
  items: Report[];
}
