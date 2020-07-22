import { fromNullable } from 'fp-ts/lib/Option';

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
    case ErrorCodeEnum.passwordMismatch:
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
