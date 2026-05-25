import { isDangerObject } from './is-danger-object';

export function sanitizeValue(
  val: any,
  seen: WeakSet<object>,
  maskFields: string[],
  dropFields: string[],
): any {
  if (val instanceof Error) {
    return { message: val.message, name: val.name };
  }

  if (typeof val !== 'object' || val === null) return val;

  if (seen.has(val)) return '[Circular]';
  seen.add(val);

  if (isDangerObject(val)) {
    return '[FilteredRequestObject]';
  }

  if (Array.isArray(val)) {
    return val.map(v =>
      sanitizeValue(v, seen, maskFields, dropFields),
    ).filter(v => v !== undefined);
  }

  const out: Record<string, any> = {};

  for (const key of Object.keys(val)) {
    if (dropFields.includes(key)) continue;

    const value = val[key];

    if (maskFields.includes(key)) {
      out[key] = '***';
      continue;
    }

    out[key] = sanitizeValue(value, seen, maskFields, dropFields);
  }

  return out;
}
