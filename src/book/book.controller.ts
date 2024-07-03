import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateBookDto } from './book.dto';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}
  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get(':bookId')
  findBookById(@Param('bookId') bookId: string) {
    console.log('bookId', bookId);
    return this.bookService.findBookById(bookId);
  }
}
