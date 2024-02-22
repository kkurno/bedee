import { TodoToCreate } from '@lib/database/collections/todo/todo.database.model';
import { CreateTodoApiBodyDto, GetTodosQueryDto, UpdateTodoStatusApiBodyDto } from '@lib/constant/dto/todo';
import { TodoStatus } from '@lib/constant/model/todo';
import { MAXIMUM_TODO_LISTS_PER_PAGE } from '@lib/constant/pagination';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';

export class TodoToCreateValidation implements Pick<TodoToCreate, 'title'> {
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  title: TodoToCreate['title'];
}

export class GetTodosQueryValidation implements GetTodosQueryDto {
  @Transform(({ value }) => Number(value))
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  offset: GetTodosQueryDto['offset'];

  @Transform(({ value }) => Number(value))
  @Max(MAXIMUM_TODO_LISTS_PER_PAGE)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  limit: GetTodosQueryDto['limit'];

  @Length(1, 255)
  @IsString()
  @IsOptional()
  searchText?: GetTodosQueryDto['searchText'];

  @IsIn(['asc', 'desc'] as GetTodosQueryDto['orderBy'][])
  @IsOptional()
  orderBy: Required<GetTodosQueryDto>['orderBy'] = 'desc';
}

export class CreateTodoApiBodyValidation implements CreateTodoApiBodyDto {
  @ValidateNested()
  @Type(() => TodoToCreateValidation)
  @IsNotEmpty()
  todo: TodoToCreateValidation;
}

export class UpdateTodoStatusApiBodyValidation implements UpdateTodoStatusApiBodyDto {
  @IsEnum(TodoStatus)
  @IsNotEmpty()
  status: UpdateTodoStatusApiBodyDto['status'];
}
