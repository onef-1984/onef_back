import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UtilModule } from 'src/util/util.module';
import { ReportResolver } from './report.resolver';

@Module({
  providers: [ReportService, ReportRepository, ReportResolver],
  imports: [AuthModule, UtilModule],
  exports: [ReportService, ReportRepository],
})
export class ReportModule {}
