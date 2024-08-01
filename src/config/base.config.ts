import { registerAs } from '@nestjs/config';

export const baseConfig = registerAs('base', () => ({
  url: process.env.BASE_URL,
}));
