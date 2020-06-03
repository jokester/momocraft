import { ReactElement, useMemo, useState } from 'react';
import { useLifeCycle } from '../generic-hooks/use-life-cycle';

interface PromiseLikeCallback<T, E = unknown> {
  (fulfill: (value: T) => void, reject: (reason: E) => void): ReactElement;
}

export function useModalApi() {
  // TODO: rewrite
}
