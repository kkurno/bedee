import { HttpStatus } from '@nestjs/common';

export const GENERAL_API_ERROR = {
  UNKNOWN_ERROR: {
    error_code: 10000,
  },
  BAD_REQUEST: {
    error_code: 10001,
  },
  NOT_FOUND: {
    error_code: 10002,
  },
} as const;

export const SERVER_API_ERROR = {
  DATABASE_CONNECTION_FAILURE: {
    error_code: 20000,
  },
} as const;

export const API_ERROR = {
  ...GENERAL_API_ERROR,
  ...SERVER_API_ERROR,
} as const;

export type ApiError = typeof API_ERROR;

export type ApiErrorKey = keyof ApiError;

export type ApiErrorObject = ApiError[ApiErrorKey];

export type ApiErrorCode = ApiError[ApiErrorKey]['error_code'];

export const API_ERROR_HTTP_STATUS_CODE: Record<ApiErrorCode, HttpStatus> = {
  [API_ERROR.UNKNOWN_ERROR.error_code]: HttpStatus.INTERNAL_SERVER_ERROR,
  [API_ERROR.BAD_REQUEST.error_code]: HttpStatus.BAD_REQUEST,
  [API_ERROR.NOT_FOUND.error_code]: HttpStatus.NOT_FOUND,
  [API_ERROR.DATABASE_CONNECTION_FAILURE.error_code]: HttpStatus.INTERNAL_SERVER_ERROR,
};
