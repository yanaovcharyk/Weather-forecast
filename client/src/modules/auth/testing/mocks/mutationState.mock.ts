import type { useMutation } from '@apollo/client/react';
import { createMutationResult } from '@/common/testing/fixtures';

export const createMutationState = (
  overrides: Partial<useMutation.Result> = {},
) => createMutationResult(overrides);
