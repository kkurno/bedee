import { validateDocumentId } from '@lib/database/utilities/id';
import { IsNotEmpty, ValidationOptions, registerDecorator } from 'class-validator';

export function IsValidDocumentId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDocumentId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: validationOptions?.message ?? `${propertyName} is not a valid Document ID`,
      },
      validator: {
        validate(value: any) {
          return validateDocumentId(value);
        },
      },
    });
  };
}

export class DocumentIdParamsValidation {
  @IsValidDocumentId()
  @IsNotEmpty()
  id: string;
}
