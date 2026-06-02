import { cleanComponentStack } from './cleanComponentStack';

export function normalizeReactError(error: Error, info: React.ErrorInfo) {
  const cleanedStack = cleanComponentStack(info.componentStack);

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,

    ui: {
      rootComponent: cleanedStack[0] ?? null,
      componentChain: cleanedStack.slice(0, 10),
      stackDepth: cleanedStack.length,
    },
  };
}
