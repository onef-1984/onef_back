import { Module } from '@nestjs/common';
import { ReportLikesService } from './report-likes.service';
import { ReportLikesRepository } from './report-likes.repository';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ReportLikesResolver } from './report-likes.resolver';
import { ReportModule } from 'src/report/report.module';

@Module({
  providers: [ReportLikesService, ReportLikesRepository, ReportLikesResolver],
  exports: [ReportLikesService, ReportLikesRepository],
  imports: [AuthModule, NotificationModule, ReportModule],
})
export class ReportLikesModule {}
