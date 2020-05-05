import React, { useCallback } from 'react';
import { Either, fold } from 'fp-ts/lib/Either';
import { RenderPromise } from './render-promise';

interface RenderPromiseEitherProps<L, R> extends React.PropsWithChildren<{}> {
  promise: Promise<Either<L, R>>;
  onPending?(): React.ReactElement;
  onReject?(e: unknown): React.ReactElement;
  onLeft?(l: L): React.ReactElement;
  children(value: R): null | React.ReactElement;
}

const renderNull = () => (null as any) as React.ReactElement;

export function RenderPromiseEither<L, R>(props: RenderPromiseEitherProps<L, R>) {
  const render = useCallback(
    (e: Either<L, R>) =>
      fold<L, R, React.ReactElement>(
        props.onLeft || renderNull,
        r => (props.children(r) || null) as React.ReactElement,
      )(e),
    [props.onLeft, props.children],
  );
  return (
    <RenderPromise onPending={props.onPending} onReject={props.onReject} promise={props.promise}>
      {render}
    </RenderPromise>
  );
}
