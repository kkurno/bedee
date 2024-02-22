export type JSONApiSuccessResponse<D = undefined> = {
  success: true;
} & (D extends undefined ? Record<any, any> : { data: D });

export type JSONApiErrorResponse = {
  success: false;
  error_code: number;
};

export type JSONApiResponse<D = undefined> = JSONApiSuccessResponse<D> | JSONApiErrorResponse;
