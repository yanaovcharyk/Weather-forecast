import { describe, it, expect } from 'vitest';
import { normalizeError } from './normalizeError';

describe('normalizeError', () => {
  it('normalizes Error instance', () => {
    const error = new Error('boom');

    const result = normalizeError(error);

    expect(result).toEqual({
      name: 'Error',
      message: 'boom',
      stack: expect.any(String),
    });
  });

  it('normalizes string error', () => {
    expect(normalizeError('fail')).toEqual({
      message: 'fail',
    });
  });

  it('normalizes unknown error', () => {
    expect(normalizeError(123)).toEqual({
      message: 'Unknown error',
      raw: '123',
    });
  });
});
