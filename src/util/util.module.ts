import { Module } from '@nestjs/common';
import { UtilFunction } from './util.resOption';

@Module({
  providers: [UtilFunction],
  exports: [UtilFunction],
})
export class UtilModule {}
