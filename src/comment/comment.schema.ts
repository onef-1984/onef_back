import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.dto';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  comment: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field({ nullable: true })
  reportId?: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => [Comment])
  replies: Comment[];

  @Field(() => User)
  user: User;
}

@ObjectType()
export class CommentList {
  @Field(() => [Comment])
  comments: Comment[];
}
