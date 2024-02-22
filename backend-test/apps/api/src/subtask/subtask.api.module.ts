import { Module } from '@nestjs/common';
import { DatabaseModule } from '@lib/database';
import { SubtaskApiControllerV1 } from './controllers/v1/subtask.api.controller.v1';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    SubtaskApiControllerV1,
  ],
})
export class SubtaskApiModule {}
