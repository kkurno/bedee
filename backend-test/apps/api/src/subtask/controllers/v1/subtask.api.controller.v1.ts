import { API_ERROR } from '@lib/constant/api/error';
import { JSONApiResponse } from '@lib/constant/api/response';
import { SubtaskStatus } from '@lib/constant/model/subtask';
import { TodoStatus } from '@lib/constant/model/todo';
import { SubtaskModel } from '@lib/database/collections/subtask/subtask.database.model';
import { TodoModel } from '@lib/database/collections/todo/todo.database.model';
import { ApiException } from '@lib/exception';
import { DocumentIdParamsValidation } from '@lib/validation/document-id';
import { CreateSubtaskApiBodyValidation, UpdateSubtaskStatusApiBodyValidation } from '@lib/validation/subtask';
import { Body, Controller, Delete, Param, Patch, Post, ValidationPipe } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'subtasks',
})
export class SubtaskApiControllerV1 {
  constructor(
    private readonly todoModel: TodoModel,
    private readonly subtaskModel: SubtaskModel,
  ) { }

  @Post()
  async createSubtask(
    @Body(new ValidationPipe({ stopAtFirstError: true, forbidUnknownValues: true })) body: CreateSubtaskApiBodyValidation,
  ): Promise<JSONApiResponse> {
    await Promise.all([
      this.subtaskModel.$insertOne({
        ...body.subtask,
        status: SubtaskStatus.Pending,
      }),
      this.todoModel.$updateOne({
        _id: {
          type: 'value',
          value: body.subtask.todo_id,
        },
      }, {
        status: TodoStatus.Pending,
      }),
    ]);
    return {
      success: true,
    };
  }

  @Patch(':id/status')
  async updateSubtaskStatus(
    @Param(new ValidationPipe({ stopAtFirstError: true })) params: DocumentIdParamsValidation,
    @Body(new ValidationPipe({ stopAtFirstError: true, forbidUnknownValues: true })) body: UpdateSubtaskStatusApiBodyValidation,
  ): Promise<JSONApiResponse> {
    // #TODO: consider about how to avoid race condition and how to implement atomic transactions

    const targetSubtask = await this.subtaskModel
      .$updateOne({
        _id: {
          type: 'value',
          value: params.id,
        },
      }, {
        status: body.status,
      });
    if (!targetSubtask) {
      throw new ApiException(API_ERROR.NOT_FOUND);
    }

    switch (body.status) {
      case SubtaskStatus.Pending: {
        await this.todoModel.$updateOne({
          _id: {
            type: 'value',
            value: targetSubtask.todo_id,
          },
        }, {
          status: TodoStatus.Pending,
        });
        break;
      }
      case SubtaskStatus.Completed: {
        const areAllSiblingSubtasksCompleted = await this.subtaskModel.$findOne({
          todo_id: {
            type: 'value',
            value: targetSubtask.todo_id,
          },
          status: {
            type: 'value',
            value: SubtaskStatus.Pending,
          },
        }).then(r => !r);
        if (areAllSiblingSubtasksCompleted) {
          await this.todoModel.$updateOne({
            _id: {
              type: 'value',
              value: targetSubtask.todo_id,
            },
          }, {
            status: TodoStatus.Completed,
          });
        }
        break;
      }
      default: {
        throw new ApiException(API_ERROR.BAD_REQUEST);
      }
    }
    return { success: true };
  }

  @Delete(':id')
  async deleteSubtask(
    @Param(new ValidationPipe({ stopAtFirstError: true })) params: DocumentIdParamsValidation,
  ): Promise<JSONApiResponse> {
    const targetSubtask = await this.subtaskModel
      .$findOne({
        _id: {
          type: 'value',
          value: params.id,
        },
      });
    if (!targetSubtask) {
      throw new ApiException(API_ERROR.NOT_FOUND);
    }
    const isDeleted = await this.subtaskModel.$deleteOne({
      _id: {
        type: 'value',
        value: targetSubtask._id,
      },
    });
    if (!isDeleted) {
      throw new ApiException(API_ERROR.UNKNOWN_ERROR);
    }
    const stillHasSubtasks = await this.subtaskModel.$findOne({
      todo_id: {
        type: 'value',
        value: targetSubtask.todo_id,
      },
    }).then(r => Boolean(r));
    if (!stillHasSubtasks) {
      await this.todoModel.$updateOne({
        _id: {
          type: 'value',
          value: targetSubtask.todo_id,
        },
      }, {
        status: TodoStatus.Pending,
      });
    }
    return { success: true };
  }
}
