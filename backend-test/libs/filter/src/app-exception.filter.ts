import {
  Catch, ArgumentsHost, HttpStatus, HttpException, BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RequestLogger, getLoggerMethod } from '@lib/logger';
import { ApiException } from '@lib/exception';
import { API_ERROR, ApiErrorObject, API_ERROR_HTTP_STATUS_CODE } from '@lib/constant/api/error';
import { JSONApiErrorResponse } from '@lib/constant/api/response';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any | void {
    let apiErrorObject: ApiErrorObject = API_ERROR.UNKNOWN_ERROR;
    let responseHttpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string | undefined;

    console.info(exception);

    if (exception instanceof ApiException) {
      apiErrorObject = exception.apiError;
      responseHttpStatus = API_ERROR_HTTP_STATUS_CODE[exception.apiError.error_code];
    }
    else if (exception instanceof BadRequestException) {
      apiErrorObject = API_ERROR.BAD_REQUEST;
      responseHttpStatus = API_ERROR_HTTP_STATUS_CODE[apiErrorObject.error_code];
      errorMessage = (exception.getResponse() as Record<string, any>).message.toString();
    }
    else if (exception instanceof HttpException) {
      responseHttpStatus = exception.getStatus();
      const exceptionResponse: Record<string, any> | string = exception.getResponse();
      if (typeof exceptionResponse === 'object' && typeof exceptionResponse.message === 'string') {
        errorMessage = exceptionResponse.message;
      }
      else if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      }
    }
    else if (exception instanceof Error) {
      errorMessage = exception.message;
    }
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const logger = new RequestLogger(request);
    logger.context = AppExceptionFilter.name;
    const loggerMethod = getLoggerMethod(responseHttpStatus);
    if (loggerMethod === 'error') {
      logger.error({ error: exception });
    }
    else {
      logger[loggerMethod]({ message: `ERROR_CODE: ${apiErrorObject.error_code}${errorMessage ? ` | ERROR_MESSAGE: ${errorMessage}` : ''}` });
    }

    response.status(responseHttpStatus).json({
      success: false,
      error_code: apiErrorObject.error_code,
    } as JSONApiErrorResponse);
  }
}
