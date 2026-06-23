import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRequiredEnvVar } from './getRequiredEnvVar';

describe('getRequiredEnvVar', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns env value', () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost');

    expect(getRequiredEnvVar('VITE_API_URL')).toBe('http://localhost');
  });

  it('throws when variable is missing', () => {
    expect(() => getRequiredEnvVar('MISSING_VAR')).toThrow(
      '[Config] Missing required environment variable: MISSING_VAR',
    );
  });
});
