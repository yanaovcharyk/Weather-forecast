import { LogResolverOptions } from './log-resolver.types';
import { LogMethod } from './log-method.decorator';

export function LogResolver(options: LogResolverOptions = {}): MethodDecorator {
  return LogMethod({
    shouldLogArguments: options.shouldLogArguments ?? true,
    shouldLogResult: options.shouldLogResult ?? false,
    shouldLogExecutionTime: options.shouldLogResult ?? true,
    fieldsToMask: options.fieldsToMask,
    fieldsToRemove: options.fieldsToRemove,
  });
}
