import { Module } from '@nestjs/common';
import { ReportLikesService } from './report-likes.service';
import { ReportLikesRepository } from './report-likes.repository';

@Module({
  providers: [ReportLikesService, ReportLikesRepository],
  exports: [ReportLikesService, ReportLikesRepository],
})
export class ReportLikesModule {}
