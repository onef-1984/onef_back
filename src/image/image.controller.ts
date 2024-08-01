import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('')
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    return await this.imageService.putImage(file);
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
