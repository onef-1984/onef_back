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

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/single-upload')
  async putImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.imageService.putImage(file);

    return { imageUrl };
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/multi-upload')
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
