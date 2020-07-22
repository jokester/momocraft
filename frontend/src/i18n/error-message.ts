import { fromNullable } from 'fp-ts/lib/Option';
import { lowerCase } from 'lodash-es';
import { isErrorCodeEnum } from '../const-shared/error-code';

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
  if (isErrorCodeEnum(errorCodeOrMessage)) {
    return lowerCase(errorCodeOrMessage);
  }
  return 'unknown errrrror';
}
