import { isObject } from './isObject';

export function isDangerObject(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }
  if (
    value instanceof Event ||
    value instanceof Node ||
    value instanceof Window ||
    value instanceof Document ||
    value instanceof Request ||
    value instanceof Response ||
    value instanceof Headers
  ) {
    return true;
  }
  return (
    'nativeEvent' in value || 'target' in value || 'currentTarget' in value
  );
}
