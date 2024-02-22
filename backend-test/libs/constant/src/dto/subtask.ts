import { SubtaskBaseModel, SubtaskStatus } from '../model/subtask';

export class CreateSubtaskApiBodyDto {
  subtask: Pick<SubtaskBaseModel, 'title' | 'todo_id'>;
}

export class UpdateSubtaskStatusApiBodyDto {
  status: SubtaskStatus;
}
