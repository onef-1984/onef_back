import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  fileNameFormatter(file: Express.Multer.File) {
    const fileName = uuidv4() + Date.now().toString();
    const ext = file.originalname.split('.').pop() ?? 'jpg';

    return { fileName, file, ext };
  }

  async putImage(file: Express.Multer.File) {
    const imageUrl = await this.imageRepository.putImageToS3(
      this.fileNameFormatter(file),
    );

    return imageUrl;
  }

  async putImages(files: Express.Multer.File[]) {
    const a = files.map((file) => this.fileNameFormatter(file));

    const imageUrl = await this.imageRepository.putImagesToS3(a);

    return imageUrl;
  }

  async getImage(fileName: string) {
    return await this.imageRepository.getImageFromS3(fileName);
  }
}
