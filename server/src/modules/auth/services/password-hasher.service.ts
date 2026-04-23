import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IPasswordHasher } from '../interfaces/password-hasher.interface';

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

@Injectable()
export class Pbkdf2PasswordHasher implements IPasswordHasher {
  async hash(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
      .toString('hex');

    return { hash, salt };
  }

  async compare(password: string, hash: string, salt: string) {
    const hashed = crypto
      .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
      .toString('hex');

    return hashed === hash;
  }
}
