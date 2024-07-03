import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { BookController } from './book.controller';

@Module({
  providers: [BookService, BookRepository],
  exports: [BookService],
  controllers: [BookController],
})
export class BookModule {}
