export const createRouterMock = () => {
  const navigate = vi.fn();

  return { navigate };
};
