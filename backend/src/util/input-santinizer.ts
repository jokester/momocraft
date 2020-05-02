import { Either, left, right } from 'fp-ts/lib/Either';

function sanitizeEmail(email: string): Either<string, string> {
  const trimmed = (email || '').trim().toLowerCase();

  if (/[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/i.test(trimmed)) {
    return right(trimmed);
  }
  return left('email malformed');
}

function sanitizePass(password: string): Either<string, string> {
  if (password && password.length > 6) {
    return right(password);
  }
  return left('password too short');
}

function userId(orig: unknown) {
  if (typeof orig === 'string' && / /.test(orig)) {
    return right(orig);
  }
  return left('incorrect userId');
}

export const Sanitize = {
  email: sanitizeEmail,
  pass: sanitizePass,
  userId,

  isString(x: unknown): x is string {
    return typeof x === 'string';
  },
} as const;
