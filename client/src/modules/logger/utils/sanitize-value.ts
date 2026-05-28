import type { JsonValue } from '../types';
import { isDangerObject } from './is-danger-object';
import { isObject } from './is-object';

const MASK = '***';
const FILTERED = '[FilteredObject]';
const CIRCULAR = '[CircularReference]';
const MAX_DEPTH = 6;
const MAX_STRING_LENGTH = 5000;
const SENSITIVE_KEY_PATTERN =
  /password|token|secret|authorization|cookie|session|api[-_]?key/i;

function truncateString(value: string): string {
  if (value.length <= MAX_STRING_LENGTH) {
    return value;
  }
  return `${value.slice(0, MAX_STRING_LENGTH)}...[TRUNCATED]`;
}

export function sanitizeValue(
  value: unknown,
  visitedObjects: WeakSet<object>,
  fieldsToMask: readonly string[],
  fieldsToRemove: readonly string[],
  depth = 0,
): JsonValue | undefined {
  if (depth > MAX_DEPTH) {
    return '[MaxDepthExceeded]';
  }
  if (value instanceof Error) {
    return { name: value.name, message: truncateString(value.message) };
  }
  if (typeof value === 'string') {
    return truncateString(value);
  }
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return value;
  }
  if (typeof value === 'undefined') {
    return undefined;
  }
  if (
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }
  if (!isObject(value)) {
    return String(value);
  }
  if (visitedObjects.has(value)) {
    return CIRCULAR;
  }
  visitedObjects.add(value);
  if (isDangerObject(value)) {
    return FILTERED;
  }
  if (
    value instanceof Blob ||
    value instanceof File ||
    value instanceof ArrayBuffer
  ) {
    return '[BinaryData]';
  }
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        sanitizeValue(
          item,
          visitedObjects,
          fieldsToMask,
          fieldsToRemove,
          depth + 1,
        ),
      )
      .filter((item): item is JsonValue => item !== undefined);
  }
  const sanitizedObject: Record<string, JsonValue> = {};
  for (const [key, objectValue] of Object.entries(value)) {
    if (fieldsToRemove.includes(key)) {
      continue;
    }
    if (fieldsToMask.includes(key) || SENSITIVE_KEY_PATTERN.test(key)) {
      sanitizedObject[key] = MASK;
      continue;
    }
    const sanitizedValue = sanitizeValue(
      objectValue,
      visitedObjects,
      fieldsToMask,
      fieldsToRemove,
      depth + 1,
    );
    if (sanitizedValue !== undefined) {
      sanitizedObject[key] = sanitizedValue;
    }
  }
  return sanitizedObject;
}
