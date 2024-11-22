import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Report } from 'src/report/report.schema';

@InputType()
export class CreateEditorsPickDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  reportId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;
}

@ObjectType()
export class EditorsPick {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field()
  createdAt: string;

  @Field()
  report: Report;
}
