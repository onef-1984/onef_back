import { Module } from '@nestjs/common';
import { RefreshMiddleware } from './refresh.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [RefreshMiddleware],
  imports: [AuthModule],
})
export class MiddlewareModule {}
