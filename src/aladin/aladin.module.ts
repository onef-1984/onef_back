import { Module } from '@nestjs/common';
import { AladinController } from './aladin.controller';
import { AladinService } from './aladin.service';
import { AladinRepository } from './aladin.repository';

@Module({
  controllers: [AladinController],
  providers: [AladinService, AladinRepository],
})
export class AladinModule {}
