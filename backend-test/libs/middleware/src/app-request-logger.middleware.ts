// latency: `${Number(((to - from) / 1000).toFixed(9))}s`,

import { RequestLogger, getLoggerMethod } from '@lib/logger';
import { LoggerMetadata } from '@lib/logger/logger.constant';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppRequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const from = Date.now();

    const logger = new RequestLogger(req);
    logger.context = 'Request - Middleware';

    const logMessage = `${req.method} ${req.originalUrl}`;

    logger.log({ message: `[Received] ${logMessage}`, metadata: { timestamp: from } });

    res.on('close', () => {
      const to = Date.now();

      const metadata: LoggerMetadata = {
        httpRequest: {
          ...logger.metadata.httpRequest,
          latency: `${Number((to - from) / 1000).toFixed(4)}s`,
          status: res.statusCode,
        },
        timestamp: to,
      };

      const loggerMethod = getLoggerMethod(res.statusCode);
      const message = `[Sent/Closed] ${logMessage}`;
      if (loggerMethod === 'error') {
        logger.error({
          error: { message },
          metadata,
        });
      }
      else {
        logger[loggerMethod]({ message, metadata });
      }
    });

    next();
  }
}
