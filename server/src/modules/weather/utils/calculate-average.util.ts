export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }

  const totalSum = values.reduce(
    (accumulatedSum: number, currentValue: number) =>
      accumulatedSum + currentValue,
    0,
  );

  return totalSum / values.length;
};
