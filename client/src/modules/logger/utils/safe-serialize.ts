import type { JsonValue } from '../types';
import { sanitizeValue } from './sanitize-value';

export function safeSerialize(
  value: unknown,
  fieldsToMask: readonly string[] = [],
  fieldsToRemove: readonly string[] = [],
): JsonValue | undefined {
  return sanitizeValue(
    value,
    new WeakSet<object>(),
    fieldsToMask,
    fieldsToRemove,
  );
}
