import { Injectable } from '@nestjs/common';
import { BaseDatabaseModel } from '../base/base.database.abstract.model';
import { TodoStatus } from '@lib/constant/model/todo';

@Injectable()
export class TodoModel extends BaseDatabaseModel {
  _collectionKey = 'todos';

  title: string;
  status: TodoStatus;
}

export type TodoDocument = TodoModel['document'];

export type TodoToCreate = Parameters<TodoModel['$insertOne']>[0];
