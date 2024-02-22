import { Injectable } from '@nestjs/common';
import { BaseDatabaseModel } from '../base/base.database.abstract.model';
import { SubtaskStatus } from '@lib/constant/model/subtask';

@Injectable()
export class SubtaskModel extends BaseDatabaseModel {
  _collectionKey: string = 'subtasks';

  title: string;
  status: SubtaskStatus;
  todo_id: string;
}

export type SubtaskDocument = SubtaskModel['document'];

export type SubtaskToCreate = Parameters<SubtaskModel['$insertOne']>[0];
