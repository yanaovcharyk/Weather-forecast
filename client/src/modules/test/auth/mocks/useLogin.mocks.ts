export const createUseLoginMocks = () => {
  const mutate = vi.fn();
  const navigate = vi.fn();
  const login = vi.fn();
  const toast = vi.fn();

  return {
    mutate,
    navigate,
    login,
    toast,
  };
};
