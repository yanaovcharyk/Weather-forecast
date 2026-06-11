import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { createValidationPipe } from './create-validation-pipe.util';

describe('createValidationPipe', () => {
  it('should build BadRequestException from validation errors', () => {
    const pipe = createValidationPipe();

    const error: ValidationError = {
      property: 'email',
      constraints: {
        isEmail: 'email must be an email',
      },
      children: [],
    } as ValidationError;

    const exception = (pipe as any).exceptionFactory([error]);

    expect(exception).toBeInstanceOf(BadRequestException);

    expect(exception.getResponse()).toEqual({
      message: 'Validation failed',
      errors: [
        {
          field: 'email',
          constraints: {
            isEmail: 'email must be an email',
          },
        },
      ],
    });
  });
});
