import { Module, OnModuleInit } from '@nestjs/common';
import { SubtaskModel } from './collections/subtask/subtask.database.model';
import { TodoModel } from './collections/todo/todo.database.model';
import { DatabaseStorage } from './database.storage';

@Module({
  providers: [
    SubtaskModel,
    TodoModel,
  ],
  exports: [
    SubtaskModel,
    TodoModel,
  ],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    return DatabaseStorage.connect();
  }
}
