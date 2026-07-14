import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { useToast } from '@/common/hooks/useToast';
import { LoggerError } from '@/logger/components/LoggerError/LoggerError';

type Props = {
  children?: ReactNode;
};

export const ErrorBoundary = ({ children }: Props) => {
  const toast = useToast();

  const showErrorToast = useCallback(() => {
    toast.error('Something went wrong');
  }, [toast]);

  return <LoggerError onError={showErrorToast}>{children}</LoggerError>;
};
