import { sanitizeValue } from './sanitize-value';

export function safeSerialize(
  value: any,
  maskFields: string[] = [],
  dropFields: string[] = [],
) {
  const seen = new WeakSet<object>();
  return sanitizeValue(value, seen, maskFields, dropFields);
}
