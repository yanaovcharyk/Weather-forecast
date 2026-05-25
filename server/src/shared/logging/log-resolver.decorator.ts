import { LogResolverOptions } from './log-resolver.types';
import { LogMethod } from './log-method.decorator';

export function LogResolver(options: LogResolverOptions = {}): MethodDecorator {
  return LogMethod({
    logArgs: options.logArgs ?? true,
    logResult: options.logResult ?? false,
    logExecutionTime: options.logExecutionTime ?? true,
    maskFields: options.maskFields,
    dropFields: options.dropFields,
  });
}
