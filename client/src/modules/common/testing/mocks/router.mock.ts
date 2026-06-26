import type { NavigateFunction, SetURLSearchParams } from 'react-router-dom';

export const createRouterMocks = (search = '') => ({
  navigate: vi.fn() as unknown as NavigateFunction,
  searchParams: new URLSearchParams(search),
  setSearchParams: vi.fn() as SetURLSearchParams,
});
