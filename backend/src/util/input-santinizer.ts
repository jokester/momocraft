import { Either, left, right } from 'fp-ts/lib/Either';
import { ErrorCodeEnum } from '../linked-frontend/model/error-code';

function sanitizeEmail(email: string): Either<string, string> {
  const trimmed = (email || '').trim().toLowerCase();

  if (/[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/i.test(trimmed)) {
    return right(trimmed.toLowerCase());
  }
  return left(ErrorCodeEnum.malformedEmail);
}

function sanitizePass(password: string): Either<string, string> {
  if (password && password.length > 6) {
    return right(password);
  }
  return left(ErrorCodeEnum.malformedPassword);
}

function userId(orig: unknown): Either<string, string> {
  if (typeof orig === 'string' && /^[ABCDEFGHJKLMNPRTUVWXYZ3456789]{5,9}$/.test(orig)) {
    return right(orig);
  }
  return left(ErrorCodeEnum.malformedUserId);
}

export const Sanitize = {
  email: sanitizeEmail,
  pass: sanitizePass,
  userId,

  isString(x: unknown): x is string {
    return typeof x === 'string';
  },
} as const;
