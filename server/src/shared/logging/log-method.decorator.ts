import { LoggerContext } from './logger-context';
import { LogMethodOptions, createLogMethodWrapper } from './log-method.core';

export function LogMethod(options: LogMethodOptions = {}): MethodDecorator {
  const wrap = createLogMethodWrapper(options);

  return (_target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: LoggerContext, ...args: any[]) {
      const className = this.constructor?.name ?? 'Unknown';
      const methodName = String(propertyKey);

      const wrapped = wrap(originalMethod, this, methodName, className);

      return wrapped(...args);
    };

    return descriptor;
  };
}
