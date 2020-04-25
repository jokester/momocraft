import { useEffect, useMemo } from 'react';

interface PublicLifecycleDelegate {
  readonly mounted: boolean;
  onMount(callback: () => void): void;
  onUnmount(callback: () => void): void;
}

class LifecycleDelegate implements PublicLifecycleDelegate {
  get mounted(): boolean {
    return this._mounted;
  }
  private _mounted = false;
  private _unmounted = false;
  private unmountCallback: (() => void)[] = [];
  private mountCallback: (() => void)[] = [];

  constructor(private readonly displayName?: string) {}

  onMount(callback: () => void): void {
    if (this._mounted) throw new Error('LifecycleDelegate: already unmounted');

    this.mountCallback.push(callback);
  }

  onUnmount(callback: () => void): void {
    if (!this.mounted) throw new Error('LifecycleDelegate: not mounted');
    if (this._unmounted) throw new Error('LifecycleDelegate: already unmounted');

    this.unmountCallback.push(callback);
  }

  /* non-public api */
  componentDidMount(): void {
    if (this.displayName) console.debug('compomentDidMount', this.displayName);
    if (this._mounted) throw new Error('LifecycleDelegate: already unmounted');

    this._mounted = true;
    for (let f; (f = this.mountCallback.shift()); f()) {}
  }

  /* non-public api */
  componentDidUnmount(): void {
    if (this.displayName) console.debug('componentDidUnmount', this.displayName);
    if (!this.mounted) throw new Error('LifecycleDelegate: not mounted');
    if (this._unmounted) throw new Error('LifecycleDelegate: already unmounted');

    this._mounted = false;
    this._unmounted = true;
    for (let f; (f = this.unmountCallback.shift()); f()) {}
  }
}

export function useLifeCycle(displayName?: string) {
  const s = useMemo<LifecycleDelegate>(() => new LifecycleDelegate(displayName), []);

  useEffect(() => {
    s.componentDidMount();
    return () => s.componentDidUnmount();
  }, []);

  return s as PublicLifecycleDelegate;
}
