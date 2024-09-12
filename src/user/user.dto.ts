import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserResponseDto {
  @ApiProperty({ description: '아이디' })
  id: string;

  @ApiProperty({ description: '역할', enum: UserRole })
  role: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '프로필 이미지' })
  profileImage: string;

  @ApiProperty({ description: '소개' })
  bio: string;
}
