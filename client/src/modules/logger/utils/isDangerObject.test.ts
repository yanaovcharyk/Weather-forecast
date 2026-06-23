import { describe, it, expect } from 'vitest';
import { isDangerObject } from './isDangerObject';

describe('isDangerObject', () => {
  it('returns false for primitives', () => {
    expect(isDangerObject(1)).toBe(false);
    expect(isDangerObject('a')).toBe(false);
    expect(isDangerObject(null)).toBe(false);
  });

  it('detects DOM/Event-like dangerous objects', () => {
    const event = new Event('click');
    expect(isDangerObject(event)).toBe(true);
  });

  it('detects objects with nativeEvent', () => {
    expect(isDangerObject({ nativeEvent: {} })).toBe(true);
  });

  it('detects objects with target/currentTarget', () => {
    expect(isDangerObject({ target: {}, currentTarget: {} })).toBe(true);
  });

  it('returns false for normal objects', () => {
    expect(isDangerObject({ a: 1 })).toBe(false);
  });
});
