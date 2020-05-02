import { Either } from 'fp-ts/lib/Either';

export type ApiResponse<T> = Promise<ApiResponseSync<T>>;
export type ApiResponseSync<T> = Either</* error code / error message */ string, T>;

export const dummyAuthState = {
  user: undefined,
  profile: null,
  pendingAuth: false,
} as const;
