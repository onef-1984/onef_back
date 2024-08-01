import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  async putImage(file: Express.Multer.File) {
    const imageName = Date.now().toString();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.imageRepository.putImageToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }

  async getImage(fileName: string) {
    const data = await this.imageRepository.getImageFromS3(fileName);

    if (!data.ok) {
      throw new NotFoundException(`Error fetching image: ${data.statusText}`);
    }

    return data;
  }
}
