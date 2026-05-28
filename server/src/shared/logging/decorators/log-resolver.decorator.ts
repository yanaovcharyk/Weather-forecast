import { LogMethod } from './log-method.decorator';
import { LogMethodOptions } from '../types';

export function LogResolver(options: LogMethodOptions = {}): MethodDecorator {
  return LogMethod({
    shouldLogArguments: options.shouldLogArguments ?? true,
    shouldLogResult: options.shouldLogResult ?? false,
    shouldLogExecutionTime: options.shouldLogExecutionTime ?? true,
    fieldsToMask: options.fieldsToMask,
    fieldsToRemove: options.fieldsToRemove,
  });
}
