import { describe, it, expect } from 'vitest';
import { isObject } from './isObject';

describe('isObject', () => {
  it('returns true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
  });

  it('returns false for primitives', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject('test')).toBe(false);
  });
});
