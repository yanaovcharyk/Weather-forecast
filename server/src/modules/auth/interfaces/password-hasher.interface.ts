import { HashPasswordParams, ComparePasswordParams, HashPasswordResult } from '../types';

export interface IPasswordHasher {
  hash(params: HashPasswordParams): Promise<HashPasswordResult>;

  compare(params: ComparePasswordParams): Promise<boolean>;
}
