import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ILoggerContext } from '@logger/types';

@Injectable()
export class LoggerContextService {
  private readonly storage =
    new AsyncLocalStorage<ILoggerContext>();

  run<T>(
    context: ILoggerContext,
    callback: () => T,
  ): T {
    return this.storage.run(context, callback);
  }

  get(): ILoggerContext {
    return this.storage.getStore() ?? {};
  }

  set(partial: Partial<ILoggerContext>) {
    const store = this.storage.getStore();

    if (!store) {
      return;
    }

    Object.assign(store, partial);
  }

  clear() {
    const store = this.storage.getStore();

    if (!store) {
      return;
    }

    Object.keys(store).forEach((key) => {
      delete store[key as keyof ILoggerContext];
    });
  }

  printContext(where: string) {
    const ctx = this.storage.getStore();

    console.log(`[CTX:${where}]`, {
      exists: !!ctx,
      keys: ctx ? Object.keys(ctx) : [],
      value: ctx,
    });
  }
}
