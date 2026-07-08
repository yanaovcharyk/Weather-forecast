import { createElement, type ElementType, type ReactNode } from 'react';

export type ProviderEntry = {
  component: ElementType;
  props?: object;
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
    (wrappedChildren, { component: Provider, props }) =>
      createElement(Provider, props, wrappedChildren),
    children,
  );
