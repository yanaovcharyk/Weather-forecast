import { formatUnixTime } from './format-unix-time.util';

describe('formatUnixTime', () => {
  it('should format unix timestamp without timezone offset', () => {
    expect(formatUnixTime(0)).toBe('00:00');
  });

  it('should apply positive timezone offset', () => {
    expect(formatUnixTime(0, 7200)).toBe('02:00');
  });

  it('should apply negative timezone offset', () => {
    expect(formatUnixTime(7200, -7200)).toBe('00:00');
  });

  it('should format arbitrary timestamp', () => {
    expect(formatUnixTime(3600)).toBe('01:00');
  });
});
