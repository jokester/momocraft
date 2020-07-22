export enum ErrorCodeEnum {
  // transport
  httpFail = 'httpFail',
  requestFail = 'requestFail',

  // auth
  notAuthenticated = 'notAuthenticated',
  forbidden = 'forbidden',
  userNotFound = 'userNotFound',
  passwordMismatch = 'passwordMismatch',
  userExisted = 'userExisted',
  oAuthEmailNotVerified = 'oAuthEmailNotVerified',
  oAuthFailed = 'oAuthFailed',

  // validation
  malformedUserId = 'malformedUserId',
  malformedEmail = 'malformedEmail',
  malformedPassword = 'malformedPassword',

  // generic resource
  maxConcurrencyExceeded = 'maxConcurrencyExceeded',

  // other
  notImplemented = 'notImplemented',
  internalError = 'internalError',
}

export function isErrorCodeEnum(x: unknown): x is ErrorCodeEnum {
  return typeof x === 'string' && x in ErrorCodeEnum;
}
