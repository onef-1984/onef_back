import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ImageController],
  providers: [ImageRepository, ImageService],
  imports: [AuthModule],
})
export class ImageModule {}
