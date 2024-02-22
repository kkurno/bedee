import { SubtaskBaseModel } from '../model/subtask';
import { TodoBaseModel, TodoStatus } from '../model/todo';

export class GetTodosQueryDto {
  offset: number;
  limit: number;
  searchText?: string;
  orderBy?: 'asc' | 'desc';
}

export class GetTodosApiResponseDto {
  todos: (
    Pick<TodoBaseModel, '_id' | 'title' | 'status' | 'created_at'>
    & {
      subtasks: Pick<SubtaskBaseModel, '_id' | 'title' | 'status' | 'todo_id' | 'created_at'>[];
    }
  )[];
  total: number;
}

export class CreateTodoApiBodyDto {
  todo: Pick<TodoBaseModel, 'title'>;
}

export class UpdateTodoStatusApiBodyDto {
  status: TodoStatus;
}
