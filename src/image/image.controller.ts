import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set('Content-Type', data.headers.get('Content-Type') || 'image/jpeg');
    res.send(buffer);
  }
}
