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

export const mockIntersectionObserver = () => {
  let callback: IntersectionObserverCallback;

  const observe = vi.fn();
  const disconnect = vi.fn();
  const unobserve = vi.fn();
  const takeRecords = vi.fn();

  class IntersectionObserverMock implements Partial<IntersectionObserver> {
    root: Element | Document | null = null;
    rootMargin = '';
    thresholds: ReadonlyArray<number> = [];
    scrollMargin = '';

    constructor(observerCallback: IntersectionObserverCallback) {
      callback = observerCallback;
    }

    observe = observe;
    disconnect = disconnect;
    unobserve = unobserve;
    takeRecords = takeRecords;

    readonly [Symbol.toStringTag] = 'IntersectionObserver';
  }

  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

  return {
    observe,
    disconnect,
    unobserve,
    takeRecords,
    trigger: (entries: Partial<IntersectionObserverEntry>[]) =>
      callback(
        entries as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
  };
};
