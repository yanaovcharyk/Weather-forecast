import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { IPasswordHasher } from '../interfaces/password-hasher.interface';
import { AppLoggerService } from '../../logger/services/app-logger.service';

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

@Injectable()
export class Pbkdf2PasswordHasher implements IPasswordHasher {
  private readonly logger;

  constructor(loggerService: AppLoggerService) {
    this.logger = loggerService.child(Pbkdf2PasswordHasher.name);
  }

  async hash(password: string) {
    this.logger.debug('Hashing password');

    const salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto
      .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
      .toString('hex');

    this.logger.info('Password hashed successfully');

    return { hash, salt };
  }

  async compare(password: string, hash: string, salt: string) {
    this.logger.debug('Comparing password hash');

    const hashed = crypto
      .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
      .toString('hex');

    const isMatch = hashed === hash;

    if (!isMatch) {
      this.logger.warn('Password comparison failed');
    }

    return isMatch;
  }
}
