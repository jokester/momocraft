import React, { PropsWithChildren } from 'react';

interface RenderArrayProps<T> {
  items: T[];
  children(item: T, index: number): React.ReactElement;
}
export function RenderArray<T>(props: PropsWithChildren<RenderArrayProps<T>>): React.ReactElement {
  return props.items.map(props.children) as any as React.ReactElement;
}
