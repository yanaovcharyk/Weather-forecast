import { isDangerObject } from './is-danger-object';

export function sanitizeValue(
  value: any,
  visitedObjects: WeakSet<object>,
  fieldsToMask: string[],
  fieldsToRemove: string[],
): any {
  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
    };
  }

  const isPrimitive = typeof value !== 'object' || value === null;

  if (isPrimitive) {
    return value;
  }

  if (visitedObjects.has(value)) {
    return '[CircularReference]';
  }

  visitedObjects.add(value);

  if (isDangerObject(value)) {
    return '[FilteredRequestObject]';
  }

  if (Array.isArray(value)) {
    return value
      .map((arrayItem) =>
        sanitizeValue(arrayItem, visitedObjects, fieldsToMask, fieldsToRemove),
      )
      .filter((sanitizedItem) => sanitizedItem !== undefined);
  }

  const sanitizedObject: Record<string, any> = {};

  for (const objectKey of Object.keys(value)) {
    if (fieldsToRemove.includes(objectKey)) {
      continue;
    }

    const objectValue = value[objectKey];

    if (fieldsToMask.includes(objectKey)) {
      sanitizedObject[objectKey] = '***';

      continue;
    }

    sanitizedObject[objectKey] = sanitizeValue(
      objectValue,
      visitedObjects,
      fieldsToMask,
      fieldsToRemove,
    );
  }

  return sanitizedObject;
}
