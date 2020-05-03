import { fromNullable } from 'fp-ts/lib/Option';

export const enum ErrorCodeEnum {
  // transport
  httpFail = 'http_fail',
  requestFail = 'request_fail',

  // auth
  notAuthenticated = 'not_authenticated',
  forbidden = 'forbidden',
  userExisted = 'user_existed',

  // validation
  malformedUserId = 'malformed_user_id',
  malformedEmail = 'malformed_email',
  malformedPassword = 'malformed_password',

  // app

  // generic resource
  maxConcurrencyExceeded = 'max_concurrency_exceeded',

  // other
  notImplemented = 'not_implemented',
  internalError = 'internal_error',
}
export function deriveErrorMessage(errorCodeOrMessage: unknown) {
  return fromNullable(_deriveErrorMessage(errorCodeOrMessage));
}

export function _deriveErrorMessage(errorCodeOrMessage: unknown) {
  switch (errorCodeOrMessage) {
    case ErrorCodeEnum.httpFail:
      return '网络错误';

    case ErrorCodeEnum.malformedEmail:
      return 'email格式不正确';
    case ErrorCodeEnum.malformedUserId:
      return '用户id格式不正确';
    case ErrorCodeEnum.malformedPassword:
      return '密码需有7位以上';

    case ErrorCodeEnum.notAuthenticated:
      return '需要登录';
    case ErrorCodeEnum.userExisted:
      return '用户已存在';
    case ErrorCodeEnum.forbidden:
      return '需要重新登录';

    case ErrorCodeEnum.notImplemented:
      return '还没做';
  }
  return null;
}
