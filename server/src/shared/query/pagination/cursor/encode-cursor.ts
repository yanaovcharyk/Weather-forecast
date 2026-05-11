export const encodeCursor = (
  payload: unknown,
): string => {
  return Buffer.from(
    JSON.stringify(payload),
  ).toString('base64');
};
