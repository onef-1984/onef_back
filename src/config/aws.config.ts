import { registerAs } from '@nestjs/config';

export const awsConfig = registerAs('jwt', () => ({
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_S3_IMAGE_BUCKET_NAME,
}));
