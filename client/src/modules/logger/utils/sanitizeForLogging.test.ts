import { describe, it, expect, vi, afterEach } from 'vitest';
import { sanitizeForLogging } from './sanitizeForLogging';
import * as isObjectModule from './isObject';

type Circular = {
  self?: Circular;
};

type Nested = {
  next?: Nested;
};

describe('sanitizeForLogging', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('masks sensitive fields', () => {
    const result = sanitizeForLogging({
      password: '123',
      token: 'abc',
      email: 'test@test.com',
    });

    expect(result).toEqual({
      password: '***',
      token: '***',
      email: 'test@test.com',
    });
  });

  it('removes specified fields', () => {
    const result = sanitizeForLogging({ a: 1, b: 2, c: 3 }, [], ['b']);

    expect(result).toEqual({
      a: 1,
      c: 3,
    });
  });

  it('handles arrays', () => {
    const result = sanitizeForLogging([{ password: '123' }, { ok: true }]);

    expect(result).toEqual([{ password: '***' }, { ok: true }]);
  });

  it('filters dangerous objects', () => {
    const result = sanitizeForLogging({
      event: new Event('click'),
    });

    expect(result).toEqual({
      event: '[FilteredObject]',
    });
  });

  it('handles circular references', () => {
    const obj: Circular = {};
    obj.self = obj;

    const result = sanitizeForLogging(obj);

    expect(result).toEqual({
      self: '[CircularReference]',
    });
  });

  it('truncates long strings', () => {
    const long = 'a'.repeat(6000);

    const result = sanitizeForLogging(long);

    expect((result as string).endsWith('[TRUNCATED]')).toBe(true);
  });

  it('handles nested objects with depth limit', () => {
    const obj: Nested = {};
    let current = obj;

    for (let i = 0; i < 10; i++) {
      current.next = {};
      current = current.next;
    }

    const result = sanitizeForLogging(obj);

    expect(JSON.stringify(result)).toContain('[MaxDepthExceeded]');
  });

  it('returns undefined for undefined values', () => {
    expect(sanitizeForLogging(undefined)).toBeUndefined();
  });

  it('serializes functions, symbols and bigint', () => {
    const fnResult = sanitizeForLogging(() => 'x');

    expect(fnResult).toBe('() => "x"');

    expect(sanitizeForLogging(Symbol('test'))).toBe('Symbol(test)');
    expect(sanitizeForLogging(BigInt(123))).toBe('123');
  });

  it('handles Error instances', () => {
    const result = sanitizeForLogging(new Error('boom'));

    expect(result).toEqual({
      name: 'Error',
      message: 'boom',
    });
  });

  it('returns primitive values unchanged', () => {
    expect(sanitizeForLogging(123)).toBe(123);
    expect(sanitizeForLogging(true)).toBe(true);
    expect(sanitizeForLogging(null)).toBe(null);
  });

  it('handles binary data', () => {
    expect(sanitizeForLogging(new Blob(['test']))).toBe('[BinaryData]');
    expect(sanitizeForLogging(new ArrayBuffer(8))).toBe('[BinaryData]');
  });

  it('masks explicitly configured fields', () => {
    const result = sanitizeForLogging(
      { username: 'john', customSecret: 'abc' },
      ['customSecret'],
    );

    expect(result).toEqual({
      username: 'john',
      customSecret: '***',
    });
  });

  it('removes undefined values from arrays', () => {
    const result = sanitizeForLogging([1, undefined, 2]);

    expect(result).toEqual([1, 2]);
  });

  it('removes undefined object properties', () => {
    const result = sanitizeForLogging({
      a: 1,
      b: undefined,
    });

    expect(result).toEqual({
      a: 1,
    });
  });

  it('serializes non-object host values via String()', () => {
    const value = Object.create(null);

    const result = sanitizeForLogging(value);

    expect(result).toBe('[object Object]');
  });

  it('uses safeStringify when isObject returns false', () => {
    vi.spyOn(isObjectModule, 'isObject').mockReturnValue(false);

    const date = new Date('2024-01-01');

    const result = sanitizeForLogging(date);

    expect(result).toBe(String(date));
  });

  it('returns [Unstringifiable] when String() throws', () => {
    vi.spyOn(isObjectModule, 'isObject').mockReturnValue(false);

    const value = {
      [Symbol.toPrimitive]() {
        throw new Error('boom');
      },
    };

    expect(sanitizeForLogging(value)).toBe('[Unstringifiable]');
  });
});
