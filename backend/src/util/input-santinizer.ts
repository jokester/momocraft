import { Either, left, right } from "fp-ts/lib/Either";

export function sanitizeEmail(email: string): Either<string, string> {
  const trimmed = email.trim();

  if (/[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/i.test(trimmed)) {
    return right(trimmed);
  }
  return left('email malformed')
}
