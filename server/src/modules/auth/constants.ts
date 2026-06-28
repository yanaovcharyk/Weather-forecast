export const PBKDF2_ITERATIONS = 100_000;
export const PBKDF2_KEY_LENGTH = 64;
export const PBKDF2_DIGEST_ALGORITHM = 'sha512';
export const PBKDF2_ENCODING = 'hex';

export enum AuthErrorMessage {
  COMPARISON_FAILED = 'Password comparison failed',
}

export enum JwtConfigKey {
  ACCESS_SECRET = 'jwt.accessSecret',
  REFRESH_SECRET = 'jwt.refreshSecret',
  ACCESS_EXPIRES = 'jwt.accessExpires',
  REFRESH_EXPIRES = 'jwt.refreshExpires',
}
