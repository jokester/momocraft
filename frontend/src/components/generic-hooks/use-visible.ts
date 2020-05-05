import {
  createContext,
  createElement,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { inServer } from '../../config/build-env';

const ObserverContext = createContext<ReturnType<typeof initObserver>>(null!);

interface VisibilityObserverCallback {
  (visible: boolean): /* stop observe */ boolean;
}

function initObserver() {
  if (inServer) {
    return {
      observer: {
        disconnect() {},
      } as IntersectionObserver,
      startObserve() {},
      stopObserve() {},
    } as const;
  }
  const callbacks = new Map<Element, VisibilityObserverCallback>();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const cb = callbacks.get(entry.target);

        if (cb) {
          const visible = entry.isIntersecting || entry.intersectionRatio > 0;

          const shouldStopObserve = cb(visible);
          if (shouldStopObserve) {
            stopObserve(entry.target);
          }
        } else {
          stopObserve(entry.target);
        }
      });
    },
    // { rootMargin: '200px' },
  );

  const startObserve = (element: Element, cb: VisibilityObserverCallback) => {
    callbacks.set(element, cb);
    observer.observe(element);
  };

  const stopObserve = (el: Element) => {
    observer.unobserve(el);
    callbacks.delete(el);
  };

  return {
    observer,
    startObserve,
    stopObserve,
  } as const;
}

export const ObserverInstanceProvider: FunctionComponent<{}> = ({ children }) => {
  const observer = useMemo(initObserver, []);

  useEffect(() => observer.observer.disconnect(), []);

  return createElement(ObserverContext.Provider, { value: observer, children });
};

export function useVisible<T extends Element>(initial: boolean) {
  const ref = useRef<T>(null);
  const observer = useContext(ObserverContext);
  const [visible, setVisible] = useState(initial || /* always true in SSR */ inServer);

  useEffect(() => {
    if (!visible) {
      let live = true;
      const el = ref.current;
      if (el) {
        observer.startObserve(el, visible => {
          if (live && visible) {
            setVisible(visible);
            return visible;
          }
          return false;
        });
      }
      return () => {
        el && observer.stopObserve(el);
        live = false;
      };
    }
    return;
  }, [/* not really helpful */ ref.current]);

  return [ref, visible] as const;
}
