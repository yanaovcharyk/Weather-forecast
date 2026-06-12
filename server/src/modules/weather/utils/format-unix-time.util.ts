export const formatUnixTime = (
  unixTimestamp: number,
  timezoneOffsetInSeconds = 0,
): string => {
  const timestampWithTimezone =
    (unixTimestamp + timezoneOffsetInSeconds) * 1000;

  return new Date(timestampWithTimezone)
    .toISOString()
    .slice(11, 16);
};
