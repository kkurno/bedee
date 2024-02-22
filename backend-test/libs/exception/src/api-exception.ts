import { ApiErrorObject } from '@lib/constant/api/error';

export class ApiException extends Error {
  name = 'ApiException';
  apiError: ApiErrorObject;

  constructor(apiErrorObject: ApiErrorObject) {
    super(`ERROR_CODE: ${apiErrorObject.error_code.toString()}`);
    this.apiError = apiErrorObject;
  }
}
