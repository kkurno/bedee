import { DatabaseModule } from '@lib/database';
import { TodoDatabaseModule, TodoToCreate } from '@lib/database/todo';
import { TodoDatabaseService } from '@lib/database/todo/services/todo.database.service';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { faker } from '@faker-js/faker';
import { SubtaskDatabaseModule, SubtaskToCreate } from '@lib/database/subtask';
import { SubtaskDatabaseService } from '@lib/database/subtask/services/subtask.database.service';
import { LoggerModule, NestJsLogger, TransientLogger } from '@lib/logger';

const TOTAL_TODOS_TO_BE_SEEDED = 32;

const TODOS_TO_SEEDED = [...new Array(TOTAL_TODOS_TO_BE_SEEDED)].map<(TodoToCreate & { subtasks: SubtaskToCreate[] })>((_, i) => {
  const totalSubtasks = faker.number.int({ min: 0, max: 10 });

  switch (i % 3) {
    case 0: {
      return {
        title: 'Airlines',
        subtasks: [...new Array(totalSubtasks)].map(() => ({ title: faker.airline.airline().name, todo_id: '' })),
      };
    }
    case 1: {
      return {
        title: 'Animals',
        subtasks: [...new Array(totalSubtasks)].map(() => ({ title: faker.animal.type(), todo_id: '' })),
      };
    }
    case 2: {
      return {
        title: 'Cities',
        subtasks: [...new Array(totalSubtasks)].map(() => ({ title: faker.location.city(), todo_id: '' })),
      };
    }
    default: {
      throw new Error('Something went wrong');
    }
  }
});

@Module({
  imports: [
    DatabaseModule,
    TodoDatabaseModule,
    SubtaskDatabaseModule,
    LoggerModule,
  ],
})
class ScriptModule { }

export default async function run() {
  const app = await NestFactory.createApplicationContext(ScriptModule, {
    logger: new NestJsLogger(),
  });
  const todoDatabaseService = app.get(TodoDatabaseService);
  const subtaskDatabaseService = app.get(SubtaskDatabaseService);
  const transientLogger = await app.resolve(TransientLogger);

  transientLogger.log({ message: 'start seeding data...' });

  const seededTodos = await todoDatabaseService.todoModel.create(TODOS_TO_SEEDED, { ordered: true });
  await Promise.all(seededTodos.map(async (todo, i) => {
    return subtaskDatabaseService.subtaskModel.create(TODOS_TO_SEEDED[i].subtasks.map(subtask => ({ ...subtask, todo_id: todo._id })));
  }));

  transientLogger.log({ message: 'done.' });

  await app.close();

  console.info('app closed!');
}
