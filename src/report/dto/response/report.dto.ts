import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Book } from 'src/book/book.schema';
import { UserResponseDto } from 'src/user/user.dto';

export class User extends PickType(UserResponseDto, [
  'id',
  'nickname',
] as const) {}

@ObjectType()
export class Count {
  @ApiProperty()
  @Field(() => Int)
  userLiked: number;
}

@ObjectType()
export class ReportList {
  @Field()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Field()
  title: string;

  @ApiProperty()
  @Field()
  content: string;

  @ApiProperty()
  @Field()
  createdAt: Date;

  @ApiProperty()
  @Field()
  updatedAt: Date;

  @Field(() => Count)
  @ApiProperty()
  count: Count;

  @ApiProperty()
  @Field(() => Book)
  book: Book;

  // @ApiProperty()
  // @Field(() => User)
  // user: User;
}

export class ReportListResponseDto {
  @ApiProperty()
  hasNext: boolean;

  @ApiProperty({ type: [ReportList] })
  items: ReportList[];
}
