type DebouncedSearchParams = {
  delay: number;
  minQueryLength: number;
};

type SearchCallback = (query: string) => void;

export const createDebouncedSearch = ({
  delay,
  minQueryLength,
}: DebouncedSearchParams) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (callback: SearchCallback, query: string): void => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    if (query.length < minQueryLength) {
      return;
    }

    timer = setTimeout(() => {
      callback(query);
    }, delay);
  };
};
