import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }
    throw new HttpException(
      { errors: this.formatError(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  formatError(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      console.log('reduce - >', acc, err);
      return acc;
    }, {});
  }
}
// PipeTransform - функция, которая трансформирует наши данные.
// plainToClass - метод, который конвертирует "value" и "metadata" в необходимый нам формат
// по факту, мы провели implements той же логикой, что и есть в ValidationPipe
// "err.property" - это наше поле с ошибками ('body', 'title'...)
