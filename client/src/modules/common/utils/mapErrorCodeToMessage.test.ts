import { describe, expect, it } from 'vitest';

import { mapErrorCodeToMessage } from './mapErrorCodeToMessage';

describe('mapErrorCodeToMessage', () => {
  it.each([
    ['UNAUTHENTICATED', 'Please login again'],
    ['UNAUTHORIZED', 'You have no permission'],
    ['CITY_LIMIT', 'You can add maximum 10 cities'],
    ['CITY_EXISTS', 'City already exists'],
    ['INVALID_CITY', 'Invalid city name'],
  ])('maps %s', (code, message) => {
    expect(mapErrorCodeToMessage(code)).toBe(message);
  });

  it('returns fallback message', () => {
    expect(mapErrorCodeToMessage()).toBe('Something went wrong');

    expect(mapErrorCodeToMessage('OTHER')).toBe('Something went wrong');
  });
});
