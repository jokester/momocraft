import { Either, flatten, map } from 'fp-ts/lib/Either';

export type ApiResponse<T> = Promise<ApiResponseSync<T>>;
export type ApiResponseSync<T> = Either</* error code / error message */ string, T>;

export const dummyAuthState = {
  user: undefined,
  profile: null,
  pendingAuth: false,
} as const;

export const ApiConvention = {
  multi2: <A, B, E>(a: Either<E, A>, b: Either<E, B>): Either<E, [A, B]> => {
    return flatten(map((a: A) => map((b: B) => [a, b] as [A, B])(b))(a));
  },
};
