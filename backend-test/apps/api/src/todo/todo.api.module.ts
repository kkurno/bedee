import { Module } from '@nestjs/common';
import { TodoApiControllerV1 } from './controllers/v1/todo.api.controller.v1';
import { DatabaseModule } from '@lib/database';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    TodoApiControllerV1,
  ],
})
export class TodoApiModule {}
