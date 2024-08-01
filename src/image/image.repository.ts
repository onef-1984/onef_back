import { Inject, Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { awsConfig } from 'src/config/aws.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ImageRepository {
  s3Client: S3Client;

  constructor(
    @Inject(awsConfig.KEY) private aws: ConfigType<typeof awsConfig>,
  ) {
    this.s3Client = new S3Client({
      region: aws.region,
      credentials: {
        accessKeyId: aws.accessKey,
        secretAccessKey: aws.accessSecretKey,
      },
    });
  }

  async putImageToS3(
    fileName: string, // 업로드될 파일의 이름
    file: Express.Multer.File, // 업로드할 파일
    ext: string, // 파일 확장자
  ) {
    // AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
    const command = new PutObjectCommand({
      Bucket: this.aws.bucketName, // S3 버킷 이름
      Key: fileName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command);

    // 업로드된 이미지의 URL을 반환합니다.
    return `https://${this.aws.bucketName}.s3.${this.aws.region}.amazonaws.com/${fileName}`;
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
