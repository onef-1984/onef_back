import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { BookResolver } from './book.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [BookService, BookRepository, BookResolver],
  exports: [BookService, BookRepository],
  imports: [AuthModule],
})
export class BookModule {}
