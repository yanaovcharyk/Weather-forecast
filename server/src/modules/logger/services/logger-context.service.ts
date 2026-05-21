import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface LoggerContext {
  requestId?: string;
  userId?: string;
  ip?: string;
  context?: string;
}

@Injectable()
export class LoggerContextService {
  private readonly storage =
    new AsyncLocalStorage<LoggerContext>();

  run<T>(
    context: LoggerContext,
    callback: () => T,
  ): T {
    return this.storage.run(context, callback);
  }

  get(): LoggerContext {
    return this.storage.getStore() ?? {};
  }

  set(partial: Partial<LoggerContext>) {
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
      delete store[key as keyof LoggerContext];
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
