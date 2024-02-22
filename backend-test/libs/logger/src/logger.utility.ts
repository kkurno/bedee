import { IS_STATUS_3XX, IS_STATUS_4XX, IS_STATUS_5XX } from '@lib/utility';

export const getLoggerMethod = (httpStatusCode: number) => {
  if (IS_STATUS_3XX.test(httpStatusCode.toString())) return 'log';
  if (IS_STATUS_4XX.test(httpStatusCode.toString())) return 'warn';
  if (IS_STATUS_5XX.test(httpStatusCode.toString())) return 'error';
  return 'log';
};
