import {
  PartialType,
  OmitType,
  PickType,
  Field,
  InputType,
} from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType()
export class SignUpInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  nickname: string;

  @IsOptional()
  @IsUrl({}, { message: '올바른 URL을 입력해주세요.' })
  @Field({ nullable: true })
  profileImage?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  bio?: string;
}

@InputType()
export class SignInInput extends PickType(SignUpInput, [
  'email',
  'password',
] as const) {}

@InputType()
export class ChangeProfileInput extends PartialType(
  OmitType(SignUpInput, ['email', 'password'] as const),
) {}

@InputType()
export class ChangePasswordInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  newPassword: string;
}
