export enum SubtaskStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

export class SubtaskBaseModel {
  _id: string;
  title: string;
  status: SubtaskStatus;
  todo_id: string;
  created_at: string;
}
