import { Field, InputType } from '@nestjs/graphql';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentBodyDto {
  @IsNumber()
  @IsNotEmpty()
  depth: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class CreateCommentParamDto {
  @IsString()
  @IsNotEmpty()
  parentId: string;
}

export class CreateCommentReqDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class CreateCommentDto extends IntersectionType(
  CreateCommentBodyDto,
  CreateCommentParamDto,
  CreateCommentReqDto,
) {}

export class PutCommentDto extends PickType(CreateCommentBodyDto, [
  'comment',
]) {}

@InputType()
export class CreateComment {
  @IsString()
  @IsNotEmpty()
  @Field()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  @Field()
  depth: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  parentId: string;
}
