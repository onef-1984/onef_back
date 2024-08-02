import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  async putImage(file: Express.Multer.File) {
    const imageName = uuidv4() + Date.now().toString();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.imageRepository.putImageToS3({
      fileName: `${imageName}.${ext}`,
      file,
      ext,
    });

    return imageUrl;
  }

  async putImages(files: Express.Multer.File[]) {
    const a = files.map((file) => {
      const fileName = uuidv4() + Date.now().toString();
      const ext = file.originalname.split('.').pop();

      return { fileName, file, ext };
    });

    const imageUrl = await this.imageRepository.putImagesToS3(a);

    return imageUrl;
  }

  async getImage(fileName: string) {
    return await this.imageRepository.getImageFromS3(fileName);
  }
}
