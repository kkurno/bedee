import { Module } from '@nestjs/common';
import { DatabaseModule } from '@lib/database';
import { HealthzApiControllerV1 } from './controllers/v1/healthz.api.controller.v1';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    HealthzApiControllerV1,
  ],
})
export class HealthzApiModule {}
