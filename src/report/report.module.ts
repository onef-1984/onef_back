import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  imports: [AuthModule, UtilModule],
  exports: [ReportService],
})
export class ReportModule {}
