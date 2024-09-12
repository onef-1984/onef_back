import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEditorsPickDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '독후감 아이디' })
  reportId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '에디터스 픽 사유' })
  description: string;
}
