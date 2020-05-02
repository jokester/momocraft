export const enum ErrorCodeEnum {
  // transport
  httpFail = 'http_fail',
  requestFail = 'request_fail',

  // auth
  notAuthenticated = 'not_authenticated',
  forbidden = 'forbidden',

  // app

  // generic resource
  maxConcurrencyExceeded = 'max_concurrency_exceeded',

  // other
  notImplemented = 'not_implemented',
}
