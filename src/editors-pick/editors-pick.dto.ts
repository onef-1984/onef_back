import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEditorsPickDto {
  @IsNotEmpty()
  @IsString()
  reportId: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
