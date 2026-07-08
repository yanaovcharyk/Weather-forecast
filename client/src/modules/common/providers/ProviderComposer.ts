import { createElement, type ElementType, type ReactNode } from 'react';

export type ProviderEntry = {
  component: ElementType;
  order: number;
};

type ProviderComposerProps = {
  providers: ProviderEntry[];
  children: ReactNode;
};

export const ProviderComposer = ({
  providers,
  children,
}: ProviderComposerProps) =>
  providers.reduceRight(
    (wrappedChildren, { component: Provider }) =>
      createElement(Provider, null, wrappedChildren),
    children,
  );
