import { useContext } from 'react';

export function createSafeContext<T>(
  context: React.Context<T | null>,
  name: string,
) {
  return function useSafeContext() {
    const value = useContext(context);

    if (!value) {
      throw new Error(`${name} must be used within ${name}Provider`);
    }

    return value;
  };
}
