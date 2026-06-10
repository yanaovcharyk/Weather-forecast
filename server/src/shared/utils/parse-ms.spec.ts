import { parseMs } from './parse-ms';

describe('parseMs', () => {
  it('parses valid ms strings into numbers', () => {
    expect(parseMs('1s')).toBe(1000);
    expect(parseMs('2m')).toBe(120000);
    expect(parseMs('1h')).toBe(3600000);
    expect(parseMs('1d')).toBe(86400000);
  });

  it('throws error for invalid ms strings', () => {
    expect(() => parseMs('abc' as any)).toThrow();
    expect(() => parseMs('' as any)).toThrow();
  });

  it('returns a number type', () => {
    const result = parseMs('500ms');
    expect(typeof result).toBe('number');
    expect(result).toBe(500);
  });
});
