export const decodeCursor = <T>(
  cursor: string,
): T => {
  return JSON.parse(
    Buffer.from(cursor, 'base64').toString(),
  );
};
