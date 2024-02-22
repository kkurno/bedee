import { Injectable, Scope } from '@nestjs/common';
import { BaseLogger } from './base.logger.service';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class TransientLogger extends BaseLogger {}
