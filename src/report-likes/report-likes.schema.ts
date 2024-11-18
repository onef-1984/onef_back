import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@ObjectType()
export class IsLiked {
  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isLiked: boolean;
}
