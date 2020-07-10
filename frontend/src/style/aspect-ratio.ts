import { CSSProperties } from 'react';

export function createAspectRatioStyle(aspectRatio: number): /* React.CSSProperties */ CSSProperties {
  return { '--aspect-ratio': String(aspectRatio) } as any;
}
