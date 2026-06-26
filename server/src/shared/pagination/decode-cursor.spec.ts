import { decodeCursor } from './decode-cursor';

describe('decodeCursor', () => {
  it('should decode a valid base64 cursor', () => {
    const payload = { value: 'A', id: 1 };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');

    const result = decodeCursor<typeof payload>(encoded);

    expect(result).toEqual(payload);
  });

  it('should throw error for invalid base64 string', () => {
    expect(() => decodeCursor('not-base64')).toThrow();
  });

  it('should throw error for invalid JSON inside base64', () => {
    const invalidJson = Buffer.from('not-json').toString('base64');
    expect(() => decodeCursor(invalidJson)).toThrow();
  });
});
