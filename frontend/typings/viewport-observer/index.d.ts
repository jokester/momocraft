declare module 'viewport-observer' {
  import * as React from 'react';
  import { HTMLProps } from 'react';

  interface Props extends HTMLProps<HTMLElement> {
    root?: HTMLElement;
    tagName?: string;
    // onChange?(entry: IntersectionObserverEntry): void;
    onEnter?(): void;
    onLeave?(): void;
    children: React.ReactElement;
  }
  const ViewportObserver: React.ComponentType<Props>;

  export = ViewportObserver;
}
