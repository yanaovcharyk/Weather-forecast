import { useEffect } from 'react';

import { BlurLoaderOverlay } from '@/common/components';
import { useToast } from '@/common/hooks';

type PageGuardProps = {
  loading?: boolean;
  error?: Error | null;
  errorTitle?: string;
  errorDescription?: string;
  showLoadingOverlay?: boolean;
  children: React.ReactNode;
};

export const DataBoundary = ({
  loading,
  error,
  errorTitle,
  errorDescription,
  showLoadingOverlay = true,
  children,
}: PageGuardProps) => {
  const toast = useToast();
  const errorMessage = error
    ? (errorDescription ?? errorTitle ?? error.message)
    : null;

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    toast.error(errorMessage);
  }, [errorMessage, toast]);

  if (!showLoadingOverlay) {
    return children;
  }

  return (
    <BlurLoaderOverlay loading={loading ?? false}>{children}</BlurLoaderOverlay>
  );
};
