import { sanitizeValue } from './sanitize-value';

/**
 * Безпечна серіалізація значення.
 */
export function safeSerialize(
  value: any,
  fieldsToMask: string[] = [],
  fieldsToRemove: string[] = [],
) {
  const visitedObjects = new WeakSet<object>();
  return sanitizeValue(
    value,
    visitedObjects,
    fieldsToMask,
    fieldsToRemove,
  );
}