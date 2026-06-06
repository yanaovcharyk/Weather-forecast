import { Logger } from 'winston';

export type LoggerContext = {
  logger?: Logger;
};

export type LogMethodOptions = {
  shouldLogArguments?: boolean;
  shouldLogResult?: boolean;
  shouldLogExecutionTime?: boolean;
  fieldsToMask?: string[];
  fieldsToRemove?: string[];
};

export type SerializeHandler = {
  condition: (value: unknown) => boolean;
  handler: (
    value: any,
    sanitize: (value: unknown) => unknown,
  ) => unknown;
};

export enum SerializationPlaceholder {
  CircularReference = '[CircularReference]',
  FilteredObject = '[FilteredObject]',
  MaskedValue = '***',
}
