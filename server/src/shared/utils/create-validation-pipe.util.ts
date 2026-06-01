import { BadRequestException } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

export function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,

    exceptionFactory(errors) {
      return new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        })),
      });
    },
  });
}
