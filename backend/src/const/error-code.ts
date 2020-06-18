import { fromNullable } from 'fp-ts/lib/Option';

export const enum ErrorCodeEnum {
  // transport
  httpFail = 'http_fail',
  requestFail = 'request_fail',

  // auth
  notAuthenticated = 'not_authenticated',
  forbidden = 'forbidden',
  userExisted = 'user_existed',
  userNotFound = 'user_not_found',
  passwordUnmatch = 'password_unmatch',
  oAuthEmailNotVerified = 'oAuthEmailNotVerified',
  oAuthFailed = 'oAuthFailed',

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

export function isErrorCodeEnum(x: unknown): x is ErrorCodeEnum {
  switch (x) {
    case ErrorCodeEnum.httpFail:
    case ErrorCodeEnum.requestFail:
    case ErrorCodeEnum.notAuthenticated:
    case ErrorCodeEnum.forbidden:
    case ErrorCodeEnum.userExisted:
    case ErrorCodeEnum.userNotFound:
    case ErrorCodeEnum.passwordUnmatch:
    case ErrorCodeEnum.malformedUserId:
    case ErrorCodeEnum.malformedEmail:
    case ErrorCodeEnum.malformedPassword:
    case ErrorCodeEnum.oAuthFailed:
    case ErrorCodeEnum.oAuthEmailNotVerified:

    case ErrorCodeEnum.maxConcurrencyExceeded:
    case ErrorCodeEnum.notImplemented:
    case ErrorCodeEnum.internalError:
      return true;
  }
  return false;
}

/**
 * @deprecated need a i18n version
 * @param errorCodeOrMessage
 * @returns {Option<NonNullable<string | null>>}
 */
export function deriveErrorMessage(errorCodeOrMessage: unknown) {
  return fromNullable(_deriveErrorMessage(errorCodeOrMessage));
}

/**
 * @deprecated need a i18n version
 * @param errorCodeOrMessage
 * @returns {string | null}
 * @private
 */
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
    case ErrorCodeEnum.passwordUnmatch:
      return '密码不匹配';

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
