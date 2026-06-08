import { Request } from 'express';

export function createMockRequest(): Request {
  return {
    cookies: {},
    headers: {},
  } as unknown as Request;
}
