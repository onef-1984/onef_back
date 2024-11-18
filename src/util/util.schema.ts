import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export type UtilFnPick = <
  T extends Record<string, any>,
  K extends Array<keyof T>,
>(
  obj: T,
  keys: K,
) => Pick<T, K[number]>;
export type UtilFnOmit = <
  T extends Record<string, any>,
  K extends Array<keyof T>,
>(
  obj: T,
  keys: K,
) => Omit<T, K[number]>;

@ObjectType()
export class Message {
  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}

@ObjectType()
export class HasNext {
  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  hasNext: boolean;
}
