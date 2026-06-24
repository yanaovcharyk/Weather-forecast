export type ControlledPromise<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

export const createControlledPromise = <T = void>(): ControlledPromise<T> => {
  let resolve!: ControlledPromise<T>['resolve'];
  let reject!: ControlledPromise<T>['reject'];

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return {
    promise,
    resolve,
    reject,
  };
};
