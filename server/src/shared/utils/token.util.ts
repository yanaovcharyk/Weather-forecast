import * as crypto from 'crypto';

export function hashTokenSha256(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSecureTokenId(): string {
  return crypto.randomBytes(16).toString('hex');
}