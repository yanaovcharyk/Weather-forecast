import {
  HashPasswordParams,
  ValidatePasswordParams,
  HashPasswordResult,
} from '../types';

export interface IPasswordHasher {
  hash(params: HashPasswordParams): Promise<HashPasswordResult>;
  validatePassword(params: ValidatePasswordParams): Promise<boolean>;
}
