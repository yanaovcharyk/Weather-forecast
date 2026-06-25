import { sanitizeForLogging } from './sanitize-for-logging';
import { SerializationPlaceholder } from '@logger/types';

describe('sanitizeForLogging', () => {
  describe('primitive values', () => {
    it.each([
      'text',
      123,
      true,
      false,
      null,
      undefined,
    ])('should return primitive value as is: %p', (value) => {
      expect(sanitizeForLogging(value)).toBe(value);
    });
  });

  describe('Error serialization', () => {
    it('should serialize Error object', () => {
      const error = new Error('boom');

      expect(sanitizeForLogging(error)).toEqual({
        name: 'Error',
        message: 'boom',
      });
    });
  });

  describe('arrays', () => {
    it('should sanitize array values recursively', () => {
      const input = [
        1,
        {
          password: 'secret',
        },
      ];

      expect(
        sanitizeForLogging(input, ['password']),
      ).toEqual([
        1,
        {
          password: SerializationPlaceholder.MaskedValue,
        },
      ]);
    });
  });

  describe('masking fields', () => {
    it('should mask specified fields', () => {
      const input = {
        email: 'test@test.com',
        password: 'secret',
      };

      expect(
        sanitizeForLogging(input, ['password']),
      ).toEqual({
        email: 'test@test.com',
        password: SerializationPlaceholder.MaskedValue,
      });
    });

    it('should mask nested fields', () => {
      const input = {
        profile: {
          password: 'secret',
        },
      };

      expect(
        sanitizeForLogging(input, ['password']),
      ).toEqual({
        profile: {
          password: SerializationPlaceholder.MaskedValue,
        },
      });
    });
  });

  describe('removing fields', () => {
    it('should remove specified fields', () => {
      const input = {
        id: 1,
        password: 'secret',
        email: 'test@test.com',
      };

      expect(
        sanitizeForLogging(input, [], ['password']),
      ).toEqual({
        id: 1,
        email: 'test@test.com',
      });
    });

    it('should remove nested fields', () => {
      const input = {
        profile: {
          password: 'secret',
          email: 'test@test.com',
        },
      };

      expect(
        sanitizeForLogging(input, [], ['password']),
      ).toEqual({
        profile: {
          email: 'test@test.com',
        },
      });
    });
  });

  describe('circular references', () => {
    it('should replace circular references', () => {
      const input: Record<string, unknown> = {
        name: 'test',
      };

      input.self = input;

      expect(sanitizeForLogging(input)).toEqual({
        name: 'test',
        self: SerializationPlaceholder.CircularReference,
      });
    });

    it('should replace nested circular references', () => {
      const parent: Record<string, unknown> = {};
      const child: Record<string, unknown> = {};

      parent.child = child;
      child.parent = parent;

      expect(sanitizeForLogging(parent)).toEqual({
        child: {
          parent: SerializationPlaceholder.CircularReference,
        },
      });
    });
  });

  describe('non serializable objects', () => {
    it('should replace request-like objects', () => {
      const input = {
        req: {},
      };

      expect(sanitizeForLogging(input)).toEqual(
        SerializationPlaceholder.FilteredObject,
      );
    });

    it('should replace response-like objects', () => {
      const input = {
        res: {},
      };

      expect(sanitizeForLogging(input)).toEqual(
        SerializationPlaceholder.FilteredObject,
      );
    });

    it('should replace socket objects', () => {
      const input = {
        socket: {},
      };

      expect(sanitizeForLogging(input)).toEqual(
        SerializationPlaceholder.FilteredObject,
      );
    });

    it('should replace objects with headers property', () => {
      const input = {
        headers: {},
      };

      expect(sanitizeForLogging(input)).toEqual(
        SerializationPlaceholder.FilteredObject,
      );
    });
  });

  describe('complex object', () => {
    it('should sanitize mixed structure', () => {
      const input = {
        id: 1,
        password: 'secret',
        profile: {
          email: 'test@test.com',
          token: 'jwt-token',
        },
        tags: ['a', 'b'],
      };

      expect(
        sanitizeForLogging(
          input,
          ['password', 'token'],
          ['id'],
        ),
      ).toEqual({
        password: SerializationPlaceholder.MaskedValue,
        profile: {
          email: 'test@test.com',
          token: SerializationPlaceholder.MaskedValue,
        },
        tags: ['a', 'b'],
      });
    });
  });
});
