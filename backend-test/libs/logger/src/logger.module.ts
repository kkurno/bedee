import { Module } from '@nestjs/common';
import { TransientLogger } from './transient-scope.logger.service';
import { RequestLogger } from './request-scope.logger.service';

@Module({
  providers: [TransientLogger, RequestLogger],
  exports: [TransientLogger, RequestLogger],
})
export class LoggerModule {}
