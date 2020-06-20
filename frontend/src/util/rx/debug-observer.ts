import { createLogger } from '../debug-logger';
import { Observer } from 'rxjs';

export function createDebugObserver(fn: string, tag: string): Observer<any> {
  const logger = createLogger(fn);

  return {
    error(whatever) {
      logger(tag, 'error', whatever);
    },
    next(whatever) {
      logger(tag, 'next', whatever);
    },
    complete() {
      logger(tag, 'complete');
    },
  };
}
