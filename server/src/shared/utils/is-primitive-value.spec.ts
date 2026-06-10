import { isPrimitiveValue } from './is-primitive-value';

describe('isPrimitiveValue', () => {
  it('returns true for primitive values', () => {
    expect(isPrimitiveValue(123)).toBe(true);
    expect(isPrimitiveValue('text')).toBe(true);
    expect(isPrimitiveValue(true)).toBe(true);
    expect(isPrimitiveValue(null)).toBe(true);
    expect(isPrimitiveValue(undefined)).toBe(true);
    expect(isPrimitiveValue(Symbol('s'))).toBe(true);
    expect(isPrimitiveValue(10n)).toBe(true);
  });

  it('returns false for objects and arrays', () => {
    expect(isPrimitiveValue({})).toBe(false);
    expect(isPrimitiveValue([])).toBe(false);
    expect(isPrimitiveValue(new Date())).toBe(false);
  });

  it('returns false for functions', () => {
    expect(isPrimitiveValue(() => {})).toBe(false);
  });
});
