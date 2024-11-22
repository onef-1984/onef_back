import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user.repository';
import { ReportModule } from 'src/report/report.module';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserService, UserRepository, UserResolver],
  imports: [AuthModule, ReportModule],
  exports: [UserService],
})
export class UserModule {}
