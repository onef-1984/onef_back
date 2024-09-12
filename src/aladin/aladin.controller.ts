import { Controller, Get, Query } from '@nestjs/common';
import { AladinService } from './aladin.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AladinBookListDto, IsbnDto } from './dto/req/aladin.dto';
import { PaginatedItemsDto } from './dto/res/aladin.dto';
import { CreateBookDto } from 'src/book/book.dto';

@ApiTags('aladin')
@Controller('aladin')
export class AladinController {
  constructor(private aladinService: AladinService) {}
  @ApiOkResponse({
    description: '검색 결과 리스트',
    type: PaginatedItemsDto,
  })
  @Get('search')
  async getBookListByKeyWord(@Query() aladinBookListDto: AladinBookListDto) {
    return this.aladinService.getBookListByKeyWord(aladinBookListDto);
  }

  @ApiOkResponse({
    description: 'isbn으로 상세 정보 조회',
    type: CreateBookDto,
  })
  @Get('detail')
  async getBookDetailByIsbn(@Query() isbnDto: IsbnDto) {
    return this.aladinService.getBookDetailByIsbn(isbnDto);
  }
}
