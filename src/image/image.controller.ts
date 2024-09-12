import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class FileUploadDto {
  @ApiProperty({ name: 'image', type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

class FilesUploadDto {
  @ApiProperty({ name: 'images', type: 'array', format: 'binary' })
  files: Express.Multer.File[];
}

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image',
    type: FileUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 단일 업로드',
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          example: 'https://onef.co.kr/api/image/...',
        },
      },
    },
  })
  @Post('/single-upload')
  async putImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.imageService.putImage(file);

    return { imageUrl };
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/multi-upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of image',
    type: FilesUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 다중 업로드',
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'array',
          items: {
            type: 'string',
            example: 'https://onef.co.kr/api/image/...',
          },
        },
      },
    },
  })
  async putImages(@UploadedFiles() files: Express.Multer.File[]) {
    const imageUrl = await this.imageService.putImages(files);

    return { imageUrl };
  }

  @Get(':fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const data = await this.imageService.getImage(fileName);

    if (data.Body instanceof Readable) {
      res.set('Content-Type', data.ContentType || 'image/jpeg');

      data.Body.pipe(res);
    } else {
      throw new NotFoundException('image not found');
    }
  }
}
