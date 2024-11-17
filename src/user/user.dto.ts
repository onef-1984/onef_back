import { Field, ObjectType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The roles of the user',
});

@ObjectType('User')
export class User {
  @Field()
  id: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  email: string;

  @Field()
  nickname: string;

  @Field()
  profileImage: string;

  @Field()
  bio: string;
}
