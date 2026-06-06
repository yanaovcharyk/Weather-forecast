
import { isPrimitiveValue } from '@shared/utils/is-primitive-value';
import { SerializationPlaceholder, SerializeHandler } from '../types';
import { isNonSerializableObject } from './is-non-serializable-object';

export function sanitizeForLogging(
  value: unknown,
  fieldsToMask: string[] = [],
  fieldsToRemove: string[] = [],
): unknown {
  const visitedObjects = new WeakSet<object>();
  const fieldsToMaskSet = new Set(fieldsToMask);
  const fieldsToRemoveSet = new Set(fieldsToRemove);

  function sanitizeValue(input: unknown): unknown {
    const handled = handlers
      .map(({ condition, handler }) =>
        condition(input) ? handler(input, sanitizeValue) : undefined,
      )
      .find((result) => result !== undefined);

    if (handled !== undefined) {
      return handled;
    }

    if (visitedObjects.has(input as object)) {
      return SerializationPlaceholder.CircularReference;
    }

    if (typeof input !== 'object' || input === null) {
      return input;
    }

    visitedObjects.add(input as object);

    return Object.fromEntries(
      Object.entries(input as Record<string, unknown>)
        .filter(([key]) => !fieldsToRemoveSet.has(key))
        .map(([key, val]) => [
          key,
          fieldsToMaskSet.has(key)
            ? SerializationPlaceholder.MaskedValue
            : sanitizeValue(val),
        ]),
    );
  }

  return sanitizeValue(value);
}

const handlers: SerializeHandler[] = [
  {
    condition: (value) => value instanceof Error,
    handler: (error: Error) => ({
      name: error.name,
      message: error.message,
    }),
  },
  {
    condition: isPrimitiveValue,
    handler: (value) => value,
  },
  {
    condition: Array.isArray,
    handler: (array: unknown[], sanitize) => array.map(sanitize),
  },
  {
    condition: isNonSerializableObject,
    handler: () => SerializationPlaceholder.FilteredObject,
  },
];
