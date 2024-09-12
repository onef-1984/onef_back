import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateBookDto } from './book.dto';
import { BookService } from './book.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @ApiCreatedResponse({
    description: '책 생성 성공',
    schema: {
      type: 'object',
      properties: {
        isbn13: {
          type: 'string',
          example: '9788966263134',
        },
      },
    },
  })
  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @ApiOkResponse({
    description: '책 조회',
    type: CreateBookDto,
  })
  @Get(':bookId')
  findBookById(@Param('bookId') bookId: string) {
    return this.bookService.findBookById(bookId);
  }
}
