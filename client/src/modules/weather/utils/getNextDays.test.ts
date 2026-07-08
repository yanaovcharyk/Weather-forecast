import { describe, it, expect, vi, afterEach } from 'vitest';
import { getNextDays } from './getNextDays';

describe('getNextDays', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return default 7 days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    const result = getNextDays();

    expect(result).toHaveLength(7);
  });

  it('should start from tomorrow', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z')); // Monday

    const result = getNextDays(3);

    expect(result[0].label).toBe('Tue');
    expect(result[1].label).toBe('Wed');
    expect(result[2].label).toBe('Thu');
  });

  it('should correctly increment dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    const result = getNextDays(2);

    const d1 = new Date('2024-01-02T00:00:00Z');
    const d2 = new Date('2024-01-03T00:00:00Z');

    expect(result[0].date.getDate()).toBe(d1.getDate());
    expect(result[1].date.getDate()).toBe(d2.getDate());
  });
});
