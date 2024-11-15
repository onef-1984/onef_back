import { ApiProperty, PickType } from '@nestjs/swagger';
import { Book } from '@prisma/client';
import { UserResponseDto } from 'src/user/user.dto';

export class User extends PickType(UserResponseDto, [
  'id',
  'nickname',
] as const) {}

export class Count {
  @ApiProperty()
  userLiked: number;
}

export class ReportList {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  count: Count;

  @ApiProperty()
  book: Book;

  @ApiProperty()
  user: User;
}

export class ReportListResponseDto {
  @ApiProperty()
  hasNext: boolean;

  @ApiProperty({ type: [ReportList] })
  items: ReportList[];
}
