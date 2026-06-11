import { isNonSerializableObject } from './is-non-serializable-object';

describe('isNonSerializableObject', () => {
  it.each([
    undefined,
    null,
    'text',
    123,
    true,
    Symbol('test'),
  ])('should return false for primitive value %p', (value) => {
    expect(isNonSerializableObject(value)).toBe(false);
  });

  it('should return false for plain object', () => {
    expect(
      isNonSerializableObject({
        id: 1,
      }),
    ).toBe(false);
  });

  it.each([
    { req: {} },
    { res: {} },
    { socket: {} },
    { _readableState: {} },
    { headers: {} },
    { connection: {} },
  ])('should return true for non serializable object %p', (value) => {
    expect(isNonSerializableObject(value)).toBe(true);
  });
});
