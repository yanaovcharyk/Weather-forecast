export type LogResolverOptions = {
  shouldLogArguments?: boolean;
  shouldLogResult?: boolean;
  shouldLogExecutionTime?: boolean;
  fieldsToMask?: string[];
  fieldsToRemove?: string[];
};
