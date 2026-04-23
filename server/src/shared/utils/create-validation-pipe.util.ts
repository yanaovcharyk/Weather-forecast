import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

export function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
}
