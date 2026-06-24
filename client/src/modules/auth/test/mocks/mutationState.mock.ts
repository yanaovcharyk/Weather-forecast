import type { useMutation } from '@apollo/client/react';
import { createMutationResult } from '@/test/factories';

export const createMutationState = (
  overrides: Partial<useMutation.Result> = {},
) => createMutationResult(overrides);
