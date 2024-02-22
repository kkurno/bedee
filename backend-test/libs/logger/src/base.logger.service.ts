import * as winston from 'winston';
import { safeJsonStringify } from '@lib/utility';
import { LoggerMetadata } from './logger.constant';

export abstract class BaseLogger {
  private _logger: winston.Logger;

  private _context: string;

  constructor() {
    this._context = 'Logger';
    this._logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize({ message: true }),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return (
            `\x1b[36m${info.timestamp}`
            + `\x1b[90m [${info.context}]`
            + ` ${info.message}\x1b[0m`
            + `${info.stack ? ` \n-> Stack: ${info.stack}` : ''}`
            + `${Object.keys(info.metadata || {}).length > 0 ? `\n-> Metadata: ${safeJsonStringify(info.metadata)}` : ''}`
          );
        }),
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  get context(): string {
    return this._context;
  }

  set context(c) {
    this._context = c;
  }

  log(v: { message: string; context?: string; metadata?: LoggerMetadata }) {
    this._logger.info({ message: v.message, context: v.context ?? this._context, metadata: v.metadata });
  }

  error(v: { error: any; context?: string; metadata?: LoggerMetadata }) {
    let message = 'unknown error';
    let stack: string | undefined;

    if (v.error instanceof Error) {
      message = v.error.message;
      stack = v.error.stack;
    }
    else if (typeof v.error === 'object') {
      message = safeJsonStringify(v.error) ?? message;
    }
    else if (typeof v.error === 'string') {
      message = v.error;
    }

    this._logger.error({
      message, stack, context: v.context ?? this._context, metadata: v.metadata,
    });
  }

  warn(v: { message: string; context?: string; metadata?: LoggerMetadata }) {
    this._logger.warn({ message: v.message, context: v.context ?? this._context, metadata: v.metadata });
  }

  debug(v: { message: string; context?: string; metadata?: LoggerMetadata }) {
    this._logger.debug({ message: v.message, context: v.context ?? this._context, metadata: v.metadata });
  }

  verbose(v: { message: string; context?: string; metadata?: LoggerMetadata }) {
    this._logger.verbose({ message: v.message, context: v.context ?? this._context, metadata: v.metadata });
  }
}
