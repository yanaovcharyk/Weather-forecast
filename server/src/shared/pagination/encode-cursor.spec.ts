import { encodeCursor } from './encode-cursor';
import { decodeCursor } from './decode-cursor';

describe('encodeCursor', () => {
  it('should encode payload into base64 string', () => {
    const payload = { value: 'A', id: 1 };
    const encoded = encodeCursor(payload);

    expect(typeof encoded).toBe('string');

    const decoded = decodeCursor<typeof payload>(encoded);
    expect(decoded).toEqual(payload);
  });

  it('should handle empty object', () => {
    const payload = {};
    const encoded = encodeCursor(payload);
    const decoded = decodeCursor<typeof payload>(encoded);

    expect(decoded).toEqual({});
  });

  it('should handle primitive values', () => {
    const payload = 'test';
    const encoded = encodeCursor(payload);
    const decoded = decodeCursor<string>(encoded);

    expect(decoded).toBe('test');
  });
});
