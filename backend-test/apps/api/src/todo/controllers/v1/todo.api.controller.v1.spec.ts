import { resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { GetTodosApiResponseDto } from '@lib/constant/dto/todo';
import { TodoModel, TodoToCreate } from '@lib/database/collections/todo/todo.database.model';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoApiControllerV1 } from './todo.api.controller.v1';
import { DatabaseStorage } from '@lib/database/database.storage';
import { TodoStatus } from '@lib/constant/model/todo';
import { SubtaskModel } from '@lib/database/collections/subtask/subtask.database.model';
import { JSONApiResponse } from '@lib/constant/api/response';

const DATABASE_FILE_PATH = `${resolve(process.env.ROOT_DIR as string)}/__data-test.json`;

class GetTodosApiResponseDtoLoose implements Omit<GetTodosApiResponseDto, 'todos'> {
  todos: TodoToCreate[];
  total: number;
}

describe('TodoApiControllerV1', () => {
  let controller: TodoApiControllerV1;
  let todoModel: TodoModel;

  beforeAll(async () => {
    if (existsSync(DATABASE_FILE_PATH)) {
      unlinkSync(DATABASE_FILE_PATH);
    }

    await DatabaseStorage.connect({ storagePath: DATABASE_FILE_PATH });

    const app: TestingModule = await Test
      .createTestingModule({
        providers: [
          TodoModel,
          SubtaskModel,
        ],
        controllers: [
          TodoApiControllerV1,
        ],
      })
      .compile();

    controller = app.get<TodoApiControllerV1>(TodoApiControllerV1);
    todoModel = app.get<TodoModel>(TodoModel);
  });

  afterAll(async () => {
    await DatabaseStorage.disconnect();
    if (existsSync(DATABASE_FILE_PATH)) {
      unlinkSync(DATABASE_FILE_PATH);
    }
  });

  describe('getTodos', () => {
    const todosToCreate: TodoToCreate[] = [
      { title: 'Todo 1', status: TodoStatus.Pending },
      { title: 'Todo 2', status: TodoStatus.Pending },
    ];

    beforeAll(async () => {
      for (let i = 0; i < todosToCreate.length; i += 1) {
        await todoModel.$insertOne(todosToCreate[i]);
        await new Promise((res) => {
          setTimeout(() => {
            res('');
          }, 1);
        });
      }
    });

    afterAll(async () => {
      await todoModel.$deleteMany({});
    });

    describe('when offset = 0, limit = 12, orderBy = "asc"', () => {
      it(`should return matched todo items and total is ${todosToCreate.length}`, async () => {
        expect(await controller.getTodos({
          offset: 0,
          limit: 12,
          orderBy: 'asc',
        }))
          .toMatchObject<JSONApiResponse<GetTodosApiResponseDtoLoose>>({
            success: true,
            data: {
              todos: todosToCreate,
              total: todosToCreate.length,
            },
          });
      });
    });

    describe('when offset = 1, limit = 12, orderBy = "desc"', () => {
      it(`should return matched todo items and total is ${todosToCreate.length}`, async () => {
        expect(await controller.getTodos({
          offset: 1,
          limit: 12,
          orderBy: 'desc',
        }))
          .toMatchObject<JSONApiResponse<GetTodosApiResponseDtoLoose>>({
            success: true,
            data: {
              todos: todosToCreate.slice(0, -1),
              total: todosToCreate.length,
            },
          });
      });
    });
  });
});
