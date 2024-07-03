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
  @IsUrl()
  profileImage: string;
}

export class SignInDto extends PickType(SignUpDto, [
  'email',
  'password',
] as const) {}

export class ChangeNicknameDto extends PartialType(
  OmitType(SignUpDto, ['email'] as const),
) {}
