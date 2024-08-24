import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
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
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password1234!' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'nickname' })
  nickname: string;

  @IsOptional()
  @IsUrl({}, { message: '올바른 URL을 입력해주세요.' })
  @ApiPropertyOptional({ example: 'https://example.com' })
  profileImage?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '안녕하세요' })
  bio?: string;
}

export class SignInDto extends PickType(SignUpDto, [
  'email',
  'password',
] as const) {}

export class ChangeProfileDto extends PartialType(
  OmitType(SignUpDto, ['email', 'password'] as const),
) {}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}
