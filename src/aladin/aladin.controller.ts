import { Controller, Get, Query } from '@nestjs/common';
import { AladinService } from './aladin.service';
import { AladinBookListDto, IsbnDto } from './aladin.dto';

@Controller('aladin')
export class AladinController {
  constructor(private aladinService: AladinService) {}

  @Get('search')
  async getBookListByKeyWord(@Query() aladinBookListDto: AladinBookListDto) {
    return this.aladinService.getBookListByKeyWord(aladinBookListDto);
  }

  @Get('detail')
  async getBookDetailByIsbn(@Query() isbnDto: IsbnDto) {
    return this.aladinService.getBookDetailByIsbn(isbnDto);
  }
}
