import { Controller, Get } from '@nestjs/common';
import { ApiException } from '@lib/exception';
import { SERVER_API_ERROR } from '@lib/constant/api/error';
import { JSONApiResponse } from '@lib/constant/api/response';
import { DatabaseStorage } from '@lib/database/database.storage';

@Controller({
  version: '1',
  path: 'healthz',
})
export class HealthzApiControllerV1 {
  @Get()
  healthCheck(): JSONApiResponse {
    if (!DatabaseStorage.isConnected) {
      throw new ApiException(SERVER_API_ERROR.DATABASE_CONNECTION_FAILURE);
    }
    return { success: true };
  }
}
