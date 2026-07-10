import { BlurLoaderOverlay, ErrorPage } from '@/common/components';

type PageGuardProps = {
  loading?: boolean;
  error?: Error | null;
  errorTitle?: string;
  errorDescription?: string;
  children: React.ReactNode;
};

export const DataBoundary = ({
  loading,
  error,
  errorTitle,
  errorDescription,
  children,
}: PageGuardProps) => {
  if (error) {
    return (
      <ErrorPage
        title={errorTitle}
        description={errorDescription ?? error.message}
      />
    );
  }

  return (
    <BlurLoaderOverlay loading={loading ?? false}>{children}</BlurLoaderOverlay>
  );
};
