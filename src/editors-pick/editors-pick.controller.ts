import { Body, Controller, Get, Post } from '@nestjs/common';
import { EditorsPickService } from './editors-pick.service';
import { CreateEditorsPickDto } from './editors-pick.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('EditorsPick')
@Controller('editors-pick')
export class EditorsPickController {
  constructor(private editorsPickService: EditorsPickService) {}

  @ApiOkResponse({
    description: '에디터스픽 조회',
    schema: {
      type: 'object',
      properties: {
        editorsPick: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                example: 1,
              },
              title: {
                type: 'string',
                example: '에디터스픽 제목',
              },
              user: {
                type: 'object',
                properties: {
                  nickname: {
                    type: 'string',
                  },
                },
              },
              book: {
                type: 'object',
                properties: {
                  cover: {
                    type: 'url',
                    example: 'https://...',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get()
  async getEditorsPick() {
    return await this.editorsPickService.getEditorsPick();
  }

  @ApiCreatedResponse({
    description: '에디터스픽 생성',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '에디터스픽 생성 성공',
        },
      },
    },
  })
  @Post()
  async createEditorsPick(@Body() createEditorsPickDto: CreateEditorsPickDto) {
    const res =
      await this.editorsPickService.createEditorsPick(createEditorsPickDto);

    if (res) return { message: '에디터스픽 생성 성공' };
    else return { message: '에디터스픽 생성 실패' };
  }
}
