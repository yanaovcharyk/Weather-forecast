export function createGqlContext(req: Record<string, unknown> = {}) {
  return {
    getContext: () => ({
      req,
      jwtPayload: undefined,
      jwtToken: undefined,
    }),
  };
}
