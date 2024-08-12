import { Module } from '@nestjs/common';
import { EditorsPickService } from './editors-pick.service';
import { EditorsPickController } from './editors-pick.controller';
import { EditorsPickRepository } from './editors-pick.repository';

@Module({
  providers: [EditorsPickService, EditorsPickRepository],
  controllers: [EditorsPickController],
})
export class EditorsPickModule {}
