import { Test, TestingModule } from '@nestjs/testing';
import { HealthzApiControllerV1 } from './healthz.api.controller.v1';
import { ApiException } from '@lib/exception';
import { SERVER_API_ERROR } from '@lib/constant/api/error';
import { DatabaseStorage } from '@lib/database/database.storage';

describe('HealthzApiControllerV1', () => {
  let controller: HealthzApiControllerV1;

  beforeAll(async () => {
    const app: TestingModule = await Test
      .createTestingModule({
        controllers: [HealthzApiControllerV1],
      })
      .compile();

    controller = app.get<HealthzApiControllerV1>(HealthzApiControllerV1);
  });

  describe('healthCheck', () => {
    describe('when database connection is not ready', () => {
      it('should throw proper exception', () => {
        expect(() => controller.healthCheck()).toThrow(new ApiException(SERVER_API_ERROR.DATABASE_CONNECTION_FAILURE));
      });
    });

    describe('when database connection is ready', () => {
      it('should return data to tell that is successful', async () => {
        await DatabaseStorage.connect();
        expect(controller.healthCheck()).toStrictEqual({ success: true });
      });
    });
  });
});
