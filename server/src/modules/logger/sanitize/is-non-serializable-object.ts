export function isNonSerializableObject(value: any): boolean {
  const isObject = value !== null && typeof value === 'object';

  if (!isObject) {
    return false;
  }

  return (
    'req' in value ||
    'res' in value ||
    'socket' in value ||
    '_readableState' in value ||
    'headers' in value ||
    'connection' in value
  );
}
