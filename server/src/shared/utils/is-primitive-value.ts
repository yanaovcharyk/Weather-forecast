export function isPrimitiveValue(value: unknown): boolean {
  return value === null || typeof value !== 'object';
}
