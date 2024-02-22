import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { BaseLogger } from './base.logger.service';
import { LoggerMetadata } from './logger.constant';

@Injectable({
  scope: Scope.REQUEST,
})
export class RequestLogger extends BaseLogger {
  private _metadata: LoggerMetadata;

  constructor(@Inject(REQUEST) private request: Request) {
    super();
    this.context = 'Request';
    this._metadata = {
      httpRequest: {
        ...(this.request.method ? { requestMethod: this.request.method } : {}),
        ...(this.request.originalUrl ? { requestUrl: this.request.originalUrl } : {}),
        ...(this.request.headers['user-agent'] ? { userAgent: this.request.headers['user-agent'] } : {}),
        ...(this.request.ip ? { remoteIp: this.request.ip } : {}),
        ...(this.request.headers.referer ? { referer: this.request.headers.referer } : {}),
        ...(this.request.protocol
          ? { protocol: this.request.protocol.toUpperCase() === 'HTTP' ? `${this.request.protocol.toUpperCase()}/${this.request.httpVersion}` : this.request.protocol }
          : {}),
      },
    };
  }

  get metadata() {
    return this._metadata;
  }

  log(v: Parameters<BaseLogger['log']>[0]) {
    super.log({ ...v, metadata: { ...this._metadata, ...v.metadata } });
  }

  error(v: Parameters<BaseLogger['error']>[0]) {
    super.error({ ...v, metadata: { ...this._metadata, ...v.metadata } });
  }

  warn(v: Parameters<BaseLogger['warn']>[0]) {
    super.warn({ ...v, metadata: { ...this._metadata, ...v.metadata } });
  }

  debug(v: Parameters<BaseLogger['debug']>[0]) {
    super.debug({ ...v, metadata: { ...this._metadata, ...v.metadata } });
  }

  verbose(v: Parameters<BaseLogger['verbose']>[0]) {
    super.verbose({ ...v, metadata: { ...this._metadata, ...v.metadata } });
  }
}
