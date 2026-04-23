import { z } from 'zod';

export const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

export interface LoginMutationResponse {
  login: {
    success: boolean;
  };
}

export type LoginFormValues = z.infer<typeof schema>;
