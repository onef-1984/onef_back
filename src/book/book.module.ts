import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { BookController } from './book.controller';
import { BookResolver } from './book.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [BookService, BookRepository, BookResolver],
  exports: [BookService, BookRepository],
  controllers: [BookController],
  imports: [AuthModule],
})
export class BookModule {}
