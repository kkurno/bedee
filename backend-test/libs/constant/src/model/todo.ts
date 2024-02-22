export enum TodoStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

export class TodoBaseModel {
  _id: string;
  title: string;
  status: TodoStatus;
  created_at: string;
}
