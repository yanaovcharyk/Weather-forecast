export interface IMinMax {
  min: number;
  max: number;
}

export function getMinMax<T>(
  items: T[],
  selector: (item: T) => number,
): IMinMax {
  if (!items.length) {
    return {
      min: 0,
      max: 0,
    };
  }

  let min = selector(items[0]);
  let max = selector(items[0]);

  for (let i = 1; i < items.length; i++) {
    const value = selector(items[i]);

    if (value < min) {
      min = value;
    }

    if (value > max) {
      max = value;
    }
  }

  return { min, max };
}
