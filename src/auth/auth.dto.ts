import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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

export class ChangeNicknameDto extends PickType(SignUpDto, [
  'nickname',
] as const) {}

export class ChangeProfileImageDto extends PickType(SignUpDto, [
  'profileImage',
] as const) {}
