import { describe, expect, it } from 'vitest';
import {
  extractErrorCode,
  isPermissionError,
  isTokenError,
} from './extractErrorCode';

describe('extractErrorCode', () => {
  it('returns undefined for invalid input', () => {
    expect(extractErrorCode(null)).toBeUndefined();
    expect(extractErrorCode('error')).toBeUndefined();
  });

  it('extracts code from extensions', () => {
    expect(
      extractErrorCode({
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      }),
    ).toBe('UNAUTHENTICATED');
  });

  it('extracts nested graphql code', () => {
    expect(
      extractErrorCode({
        result: {
          errors: [
            {
              extensions: {
                code: 'UNAUTHORIZED',
              },
            },
          ],
        },
      }),
    ).toBe('UNAUTHORIZED');
  });

  it('returns undefined for non-string code', () => {
    expect(
      extractErrorCode({
        extensions: {
          code: 123,
        },
      }),
    ).toBeUndefined();
  });
});

describe('error type helpers', () => {
  it('detects token error', () => {
    expect(
      isTokenError({
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      }),
    ).toBe(true);
  });

  it('detects permission error', () => {
    expect(
      isPermissionError({
        extensions: {
          code: 'UNAUTHORIZED',
        },
      }),
    ).toBe(true);
  });

  it('returns false for unrelated error', () => {
    expect(
      isPermissionError({
        extensions: {
          code: 'OTHER',
        },
      }),
    ).toBe(false);
    expect(
      isTokenError({
        extensions: {
          code: 'OTHER',
        },
      }),
    ).toBe(false);
  });
});
