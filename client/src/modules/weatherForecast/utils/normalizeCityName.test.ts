import { describe, expect, it } from 'vitest';

import { normalizeCityName } from './normalizeCityName';

describe('normalizeCityName', () => {
  it('trims and lowercases city name', () => {
    expect(normalizeCityName('  Kyiv ')).toBe('kyiv');
  });

  it('handles mixed case names', () => {
    expect(normalizeCityName('NeW YoRk')).toBe('new york');
  });
});
