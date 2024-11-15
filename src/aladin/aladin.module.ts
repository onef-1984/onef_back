import { Module } from '@nestjs/common';
import { AladinService } from './aladin.service';
import { AladinRepository } from './aladin.repository';
import { BookModule } from 'src/book/book.module';
import { UtilModule } from 'src/util/util.module';
import { AladinResolver } from './aladin.resolver';

@Module({
  providers: [AladinResolver, AladinService, AladinRepository],
  imports: [BookModule, UtilModule],
})
export class AladinModule {}
