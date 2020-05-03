export const enum ErrorCodeEnum {
  // transport
  httpFail = 'http_fail',
  requestFail = 'request_fail',

  // auth
  notAuthenticated = 'not_authenticated',
  forbidden = 'forbidden',
  malformedUserId = 'user_not_found',
  userExisted = 'user_existed',
  malformedEmail = 'email_malformed',
  malformedPassword = 'password_malformed',

  // app

  // generic resource
  maxConcurrencyExceeded = 'max_concurrency_exceeded',

  // other
  notImplemented = 'not_implemented',
}

export function deriveErrorMessage(errorCodeOrMessage: unknown): string {
  switch (errorCodeOrMessage) {
    case ErrorCodeEnum.httpFail:
      return '网络错误';

    case ErrorCodeEnum.notAuthenticated:
      return '请登录';
    case ErrorCodeEnum.userExisted:
      return '用户已存在';
    case ErrorCodeEnum.forbidden:
      return '请重新登录';

    case ErrorCodeEnum.notImplemented:
      return '还没做';
  }
  return '内部错误';
}
