import { vi } from 'vitest';

export const useMutationMock = vi.fn();

vi.mock('@apollo/client/react', () => ({
  useMutation: useMutationMock,
}));
