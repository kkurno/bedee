import { SubtaskToCreate } from '@lib/database/collections/subtask/subtask.database.model';
import { CreateSubtaskApiBodyDto, UpdateSubtaskStatusApiBodyDto } from '@lib/constant/dto/subtask';
import { IsEnum, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubtaskStatus } from '@lib/constant/model/subtask';
import { IsValidDocumentId } from './document-id';

export class SubtaskToCreateValidation implements Pick<SubtaskToCreate, 'title' | 'todo_id'> {
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  title: SubtaskToCreate['title'];

  @IsValidDocumentId()
  @IsNotEmpty()
  todo_id: string;
}

export class CreateSubtaskApiBodyValidation implements CreateSubtaskApiBodyDto {
  @ValidateNested()
  @Type(() => SubtaskToCreateValidation)
  @IsNotEmpty()
  subtask: SubtaskToCreateValidation;
}

export class UpdateSubtaskStatusApiBodyValidation implements UpdateSubtaskStatusApiBodyDto {
  @IsEnum(SubtaskStatus)
  @IsNotEmpty()
  status: UpdateSubtaskStatusApiBodyDto['status'];
}
