import { Inject, Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { awsConfig } from 'src/config/aws.config';
import { ConfigType } from '@nestjs/config';
import { baseConfig } from 'src/config/base.config';
import { ImageFile } from './image.types';

@Injectable()
export class ImageRepository {
  s3Client: S3Client;

  uploadCommand({ fileName, file, ext }: ImageFile) {
    return new PutObjectCommand({
      Bucket: this.aws.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: `image/${ext}`,
    });
  }

  constructor(
    @Inject(awsConfig.KEY) private aws: ConfigType<typeof awsConfig>,
    @Inject(baseConfig.KEY) private base: ConfigType<typeof baseConfig>,
  ) {
    this.s3Client = new S3Client({
      region: aws.region,
      credentials: {
        accessKeyId: aws.accessKey,
        secretAccessKey: aws.accessSecretKey,
      },
    });
  }

  async putImageToS3(file: ImageFile) {
    const command = this.uploadCommand(file);

    await this.s3Client.send(command);

    return `${this.base.url}/api/image/${file.fileName}`;
  }

  async putImagesToS3(
    files: Array<ImageFile>, // 업로드할 파일 목록
  ) {
    const uploadPromises = files.map((file: ImageFile) => {
      const command = this.uploadCommand(file);

      return this.s3Client
        .send(command)
        .then(() => `${this.base.url}/api/image/${file.fileName}`);
    });

    await Promise.all(uploadPromises);

    const imageUrls = files.map(
      ({ fileName }) => `${this.base.url}/api/image/${fileName}`,
    );

    return imageUrls;
  }

  async getImageFromS3(fileName: string) {
    const command = new GetObjectCommand({
      Bucket: this.aws.bucketName,
      Key: fileName,
    });

    const data = await this.s3Client.send(command);

    return data;
  }
}
