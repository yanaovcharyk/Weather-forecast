export function createGqlContext(req: Record<string, unknown> = {}) {
  return {
    req,
    jwtPayload: undefined,
    jwtToken: undefined,
  };
}

export type MockGqlContext = ReturnType<typeof createGqlContext>;
