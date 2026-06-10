import ms, { StringValue } from 'ms';

export function parseMs(value: StringValue): number {
  const result = ms(value);

  if (typeof result !== 'number') {
    throw new Error(`Invalid ms value: ${value}`);
  }

  return result;
}
