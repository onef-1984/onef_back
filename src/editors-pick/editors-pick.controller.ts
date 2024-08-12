import { Body, Controller, Get, Post } from '@nestjs/common';
import { EditorsPickService } from './editors-pick.service';
import { CreateEditorsPickDto } from './editors-pick.dto';

@Controller('editors-pick')
export class EditorsPickController {
  constructor(private editorsPickService: EditorsPickService) {}

  @Get()
  async getEditorsPick() {
    return await this.editorsPickService.getEditorsPick();
  }

  @Post()
  async createEditorsPick(@Body() createEditorsPickDto: CreateEditorsPickDto) {
    return await this.editorsPickService.createEditorsPick(
      createEditorsPickDto,
    );
  }
}
