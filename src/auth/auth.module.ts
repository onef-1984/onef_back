import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthGuard } from './auth.guard';
import { UtilModule } from 'src/util/util.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard],
  imports: [JwtModule.register({}), UtilModule],
  exports: [AuthService],
})
export class AuthModule {}
