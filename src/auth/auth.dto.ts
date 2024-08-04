import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsOptional()
  // @IsUrl({}, { message: '올바른 URL을 입력해주세요.' })
  profileImage: string;
}

export class SignInDto extends PickType(SignUpDto, [
  'email',
  'password',
] as const) {}

export class ChangeProfileDto extends PartialType(
  OmitType(SignUpDto, ['email', 'password'] as const),
) {}

export class ChangePasswordDto extends PickType(SignUpDto, [
  'password',
] as const) {}
