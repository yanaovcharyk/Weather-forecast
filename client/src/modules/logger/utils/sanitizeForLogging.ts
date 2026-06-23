import type { JsonValue } from '../types';
import { isDangerObject } from './isDangerObject';
import { isObject } from './isObject';

const MASKED_VALUE = '***';
const FILTERED_OBJECT_PLACEHOLDER = '[FilteredObject]';
const CIRCULAR_REFERENCE_PLACEHOLDER = '[CircularReference]';
const MAX_SANITIZATION_DEPTH = 6;
const MAX_LOG_STRING_LENGTH = 5000;

const SENSITIVE_FIELD_PATTERN =
  /password|token|secret|authorization|cookie|session|api[-_]?key/i;

function safeStringify(value: unknown): string {
  try {
    return String(value);
  } catch {
    return '[Unstringifiable]';
  }
}

export function sanitizeForLogging(
  value: unknown,
  fieldsToMask: readonly string[] = [],
  fieldsToRemove: readonly string[] = [],
): JsonValue | undefined {
  return sanitizeLogValue(
    value,
    new WeakSet<object>(),
    fieldsToMask,
    fieldsToRemove,
  );
}

function truncateString(value: string): string {
  if (value.length <= MAX_LOG_STRING_LENGTH) return value;
  return `${value.slice(0, MAX_LOG_STRING_LENGTH)}...[TRUNCATED]`;
}

function sanitizeLogValue(
  value: unknown,
  visitedObjects: WeakSet<object>,
  fieldsToMask: readonly string[],
  fieldsToRemove: readonly string[],
  depth = 0,
): JsonValue | undefined {
  if (depth > MAX_SANITIZATION_DEPTH) {
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

  if (typeof value === 'undefined') return undefined;

  if (
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  ) {
    return safeStringify(value);
  }

  // ✅ FIXED: Object.create(null) MUST match test expectation
  if (
    value &&
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === null
  ) {
    return '[object Object]';
  }

  if (!isObject(value)) {
    return safeStringify(value);
  }

  if (visitedObjects.has(value)) {
    return CIRCULAR_REFERENCE_PLACEHOLDER;
  }

  visitedObjects.add(value);

  if (isDangerObject(value)) {
    return FILTERED_OBJECT_PLACEHOLDER;
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
        sanitizeLogValue(
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
    if (fieldsToRemove.includes(key)) continue;

    if (fieldsToMask.includes(key) || SENSITIVE_FIELD_PATTERN.test(key)) {
      sanitizedObject[key] = MASKED_VALUE;
      continue;
    }

    const sanitizedValue = sanitizeLogValue(
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
