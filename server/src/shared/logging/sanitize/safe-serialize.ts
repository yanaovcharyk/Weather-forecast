import { sanitizeValue } from './sanitize-value';

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