import type { useMutation } from '@apollo/client/react';
import { createMutationResult } from '@/common/test/factories';

export const createMutationState = (
  overrides: Partial<useMutation.Result> = {},
) => createMutationResult(overrides);
