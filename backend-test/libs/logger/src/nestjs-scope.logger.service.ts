import { BaseLogger } from './base.logger.service';

export class NestJsLogger extends BaseLogger {
  log(message: any, context?: string) {
    super.log({ message, context: `${context ?? 'Unknown'} - NestJS` });
  }

  error(message: any, stack?: string, context?: string) {
    super.error({ error: { message, stack }, context: `${context ?? 'Unknown'} - NestJS` });
  }

  warn(message: any, context?: string) {
    super.warn({ message, context: `${context ?? 'Unknown'} - NestJS` });
  }

  debug(message: any, context?: string) {
    super.debug({ message, context: `${context ?? 'Unknown'} - NestJS` });
  }

  verbose(message: any, context?: string) {
    super.verbose({ message, context: `${context ?? 'Unknown'} - NestJS` });
  }
}
