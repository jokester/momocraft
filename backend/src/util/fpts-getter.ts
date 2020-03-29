import { Either, isLeft } from 'fp-ts/lib/Either';
import { Option, isNone } from 'fp-ts/lib/Option';

export function getRightOrThrow<A, B>(e: Either<A, B>, onLeft: (l: A) => Error): B {
  if (isLeft(e)) {
    throw onLeft(e.left);
  }
  return e.right;
}

export function getSomeOrThrow<A>(o: Option<A>, onEmpty: () => Error): A {
  if (isNone(o)) {
    throw onEmpty();
  }
  return o.value;
}
