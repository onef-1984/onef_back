import { registerAs } from '@nestjs/config';

export const keyConfig = registerAs('jwt', () => ({
  terminateKey: process.env.TERMINATE_KEY,
  promotionKey: process.env.PROMOTION_KEY,
}));
