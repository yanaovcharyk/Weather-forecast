import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { IPasswordHasher } from '@auth/interfaces';
import {
  HashPasswordParams,
  ValidatePasswordParams,
  HashPasswordResult,
  ValidatePasswordResult,
} from '@auth/types';
import {
  AuthErrorMessage,
  PBKDF2_DIGEST_ALGORITHM,
  PBKDF2_ENCODING,
  PBKDF2_ITERATIONS,
  PBKDF2_KEY_LENGTH,
} from '@auth/constants';
import { AppLoggerService } from '@logger/services';
import { LogMethod } from '@logger/decorators';

@Injectable()
export class Pbkdf2PasswordHasher implements IPasswordHasher {
  private readonly logger;
  constructor(loggerService: AppLoggerService) {
    this.logger = loggerService.child(Pbkdf2PasswordHasher.name);
  }

  private hashPasswordWithSalt(password: string, salt: string): string {
    return pbkdf2Sync(
      password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH,
      PBKDF2_DIGEST_ALGORITHM,
    ).toString(PBKDF2_ENCODING);
  }

  @LogMethod()
  async hash(params: HashPasswordParams): Promise<HashPasswordResult> {
    const { password } = params;

    const salt = randomBytes(16).toString(PBKDF2_ENCODING);
    const hash = this.hashPasswordWithSalt(password, salt);

    return { hash, salt };
  }

  @LogMethod()
  async validatePassword(
    params: ValidatePasswordParams,
  ): Promise<ValidatePasswordResult> {
    const { password, expectedHashPassword, salt } = params;

    const candidateHashPassword = this.hashPasswordWithSalt(password, salt);
    const isValid = timingSafeEqual(
      Buffer.from(candidateHashPassword, PBKDF2_ENCODING),
      Buffer.from(expectedHashPassword, PBKDF2_ENCODING),
    );

    if (!isValid) {
      this.logger.warn(AuthErrorMessage.COMPARISON_FAILED);
    }

    return isValid;
  }
}
