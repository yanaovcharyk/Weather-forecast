export const createToastMock = () => {
  const toast = vi.fn();

  return { toast };
};
