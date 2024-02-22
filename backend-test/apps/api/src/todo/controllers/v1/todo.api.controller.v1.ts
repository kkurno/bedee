import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import dayjs from '@lib/dayjs';
import { JSONApiResponse } from '@lib/constant/api/response';
import { CreateTodoApiBodyValidation, GetTodosQueryValidation, UpdateTodoStatusApiBodyValidation } from '@lib/validation/todo';
import { TodoStatus } from '@lib/constant/model/todo';
import { TodoDocument, TodoModel } from '@lib/database/collections/todo/todo.database.model';
import { SubtaskDocument, SubtaskModel } from '@lib/database/collections/subtask/subtask.database.model';
import { DocumentIdParamsValidation } from '@lib/validation/document-id';
import { SubtaskStatus } from '@lib/constant/model/subtask';
import { ApiException } from '@lib/exception';
import { API_ERROR } from '@lib/constant/api/error';
import { GetTodosApiResponseDto } from '@lib/constant/dto/todo';

@Controller({
  version: '1',
  path: 'todos',
})
export class TodoApiControllerV1 {
  constructor(
    private readonly todoModel: TodoModel,
    private readonly subtaskModel: SubtaskModel,
  ) { }

  @Get()
  async getTodos(
    @Query(new ValidationPipe({ transform: true, stopAtFirstError: true })) query: GetTodosQueryValidation,
  ): Promise<JSONApiResponse<GetTodosApiResponseDto>> {
    const todos = await this.todoModel.$findMany({
      ...(query.searchText
        ? {
            title: {
              type: 'filter',
              filter: {
                $regex: new RegExp(query.searchText, 'i'),
              },
            },
          }
        : {}),
    });

    const sortedTodos = [...todos].sort((a, b) => {
      const createdAtTimeDiff = dayjs(a.created_at).diff(b.created_at);
      switch (query.orderBy) {
        case 'asc': return createdAtTimeDiff;
        case 'desc': return -1 * createdAtTimeDiff;
        default: return 0;
      }
    });

    const skippedLimitedTodos = sortedTodos.slice(query.offset, query.offset + query.limit);

    const todosWithSubtasks = await Promise.all(skippedLimitedTodos.map<Promise<TodoDocument & { subtasks: SubtaskDocument[] }>>(async (todo) => {
      const subtasks = await this.subtaskModel.$findMany({
        todo_id: {
          type: 'value',
          value: todo._id,
        },
      });
      return {
        ...todo,
        subtasks,
      };
    }));

    return {
      success: true,
      data: {
        todos: todosWithSubtasks,
        total: todos.length,
      },
    };
  }

  @Post()
  async createTodo(
    @Body(new ValidationPipe({ stopAtFirstError: true, forbidUnknownValues: true })) body: CreateTodoApiBodyValidation,
  ): Promise<JSONApiResponse> {
    await this.todoModel.$insertOne({
      ...body.todo,
      status: TodoStatus.Pending,
    });
    return {
      success: true,
    };
  }

  @Patch(':id/status')
  async updateTodoStatus(
    @Param(new ValidationPipe({ stopAtFirstError: true })) params: DocumentIdParamsValidation,
    @Body(new ValidationPipe({ stopAtFirstError: true, forbidUnknownValues: true })) body: UpdateTodoStatusApiBodyValidation,
  ): Promise<JSONApiResponse> {
    const [updatedTodo] = await Promise.all([
      this.todoModel.$updateOne({
        _id: {
          type: 'value',
          value: params.id,
        },
      }, {
        status: body.status,
      }),
      this.subtaskModel.$updateMany({
        todo_id: {
          type: 'value',
          value: params.id,
        },
      }, {
        status: ({
          [TodoStatus.Pending]: SubtaskStatus.Pending,
          [TodoStatus.Completed]: SubtaskStatus.Completed,
        }[body.status]),
      }),
    ]);
    if (!updatedTodo) {
      throw new ApiException(API_ERROR.NOT_FOUND);
    }
    return { success: true };
  }

  @Delete(':id')
  async deleteTodo(
    @Param(new ValidationPipe({ stopAtFirstError: true })) params: DocumentIdParamsValidation,
  ): Promise<JSONApiResponse> {
    const [isDeleted] = await Promise.all([
      this.todoModel.$deleteOne({
        _id: {
          type: 'value',
          value: params.id,
        },
      }),
      this.subtaskModel.$deleteMany({
        todo_id: {
          type: 'value',
          value: params.id,
        },
      }),
    ]);
    if (!isDeleted) {
      throw new ApiException(API_ERROR.NOT_FOUND);
    }

    return { success: true };
  }
}
