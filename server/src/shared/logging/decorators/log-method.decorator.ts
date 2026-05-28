import { LoggerContext, LogMethodOptions } from '../types';
import { createLogMethodWrapper } from './log-method.core';

export function LogMethod(options: LogMethodOptions = {}): MethodDecorator {
  const createWrappedMethod = createLogMethodWrapper(options);

  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethodImplementation = descriptor.value;

    descriptor.value = async function (
      this: LoggerContext,
      ...methodArguments: any[]
    ) {
      const className = this.constructor?.name ?? 'UnknownClass';
      const methodName = String(propertyKey);

      const wrappedMethod = createWrappedMethod(
        originalMethodImplementation,
        this,
        methodName,
        className,
      );

      return wrappedMethod(...methodArguments);
    };

    return descriptor;
  };
}
