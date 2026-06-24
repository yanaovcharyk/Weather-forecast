export const mockWindowScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
};

export const mockWindowScrollTo = () => {
  const scrollTo = vi.fn();

  vi.stubGlobal('scrollTo', scrollTo);

  return scrollTo;
};
