import { Module } from '@nestjs/common';
import { AladinController } from './aladin.controller';
import { AladinService } from './aladin.service';
import { AladinRepository } from './aladin.repository';
import { BookModule } from 'src/book/book.module';

@Module({
  controllers: [AladinController],
  providers: [AladinService, AladinRepository],
  imports: [BookModule],
})
export class AladinModule {}
