export function isDangerObject(val: any): boolean {
  return (
    val &&
    typeof val === 'object' &&
    ('req' in val ||
      'res' in val ||
      'socket' in val ||
      '_readableState' in val ||
      'headers' in val ||
      'connection' in val)
  );
}
