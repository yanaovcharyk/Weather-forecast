import { Response } from 'express';

export function createResponseMock(): Response {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
}