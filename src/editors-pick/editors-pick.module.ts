import { Module } from '@nestjs/common';
import { EditorsPickService } from './editors-pick.service';
import { EditorsPickResolver } from './editors-pick.resolver';
import { EditorsPickRepository } from './editors-pick.repository';

@Module({
  providers: [EditorsPickService, EditorsPickResolver, EditorsPickRepository],
})
export class EditorsPickModule {}
