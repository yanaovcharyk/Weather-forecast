import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { IPasswordHasher } from '../interfaces/password-hasher.interface';
import { AppLoggerService } from '../../logger/services/app-logger.service';

import {
  HashPasswordParams,
  ComparePasswordParams,
  HashPasswordResult,
} from '../types';
import { LogMethod } from '../../../shared/logging/log-method.decorator';

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

@Injectable()
export class Pbkdf2PasswordHasher
  implements IPasswordHasher
{
  private readonly logger;

  constructor(loggerService: AppLoggerService) {
    this.logger =
      loggerService.child(Pbkdf2PasswordHasher.name);
  }

  @LogMethod({
    logArgs: false,
    logResult: false,
  })
  async hash(
    params: HashPasswordParams,
  ): Promise<HashPasswordResult> {
    const { password } = params;

    const salt = crypto
      .randomBytes(16)
      .toString('hex');

    const hash = crypto
      .pbkdf2Sync(
        password,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST,
      )
      .toString('hex');

    return {
      hash,
      salt,
    };
  }

  @LogMethod({
    logArgs: false,
    logResult: false,
  })
  async compare(
    params: ComparePasswordParams,
  ): Promise<boolean> {
    const { password, hash, salt } = params;

    const hashed = crypto
      .pbkdf2Sync(
        password,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST,
      )
      .toString('hex');

    const isMatch = hashed === hash;

    if (!isMatch) {
      this.logger.warn(
        'Password comparison failed',
      );
    }

    return isMatch;
  }
}