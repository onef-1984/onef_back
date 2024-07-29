import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user.repository';
import { ReportModule } from 'src/report/report.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [AuthModule, ReportModule],
})
export class UserModule {}
