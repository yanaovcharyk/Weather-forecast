export interface IPasswordHasher {
  hash(password: string): Promise<{ hash: string; salt: string }>;
  compare(password: string, hash: string, salt: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
