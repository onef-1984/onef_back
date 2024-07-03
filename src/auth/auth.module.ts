import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';

@Module({
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
