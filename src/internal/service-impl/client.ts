import { left, right } from 'fp-ts/lib/Either';
import { ErrorCodeEnum } from '../../model/error-code';
import { createLogger } from '../../util/debug-logger';
import { ApiResponse } from '../../service/api-convention';
import { ErrorResponse } from '../../api/hanko-api';
import { buildApiRoute } from '../../api/api-route';

const logger = createLogger(__filename);

export class ApiClient {
  readonly route: ReturnType<typeof buildApiRoute>;
  constructor(private readonly _fetch: typeof fetch, apiOrigin: string) {
    this.route = buildApiRoute(apiOrigin);
  }

  getJson<T>(url: string, headers: Record<string, string>): ApiResponse<T> {
    return this.launderJsonResponse(this._fetch(url, { headers })).then(logger.tap) as ApiResponse<T>;
  }

  postJson<T>(url: string, headers: Record<string, string>, payload: object): ApiResponse<T> {
    return this.launderJsonResponse(
      this._fetch(url, {
        headers: {
          ...headers,
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    ).then(logger.tap) as ApiResponse<T>;
  }

  private async launderJsonResponse<T>(resP: Promise<Response>, assumeNoErrorOnOk = true): ApiResponse<T> {
    try {
      const res = await resP;

      if (res.ok && assumeNoErrorOnOk) {
        return right(await res.json());
      }

      switch (res.status) {
        case 401:
          return left(ErrorCodeEnum.notAuthenticated);
        case 403:
          return left(ErrorCodeEnum.forbidden);
        case 400:
        // catch it later
      }

      // assuming non-empty resBody
      const resBody: T & Partial<ErrorResponse> = await res.json();

      if (typeof resBody?.message === 'string') return left(resBody.message);
      if (typeof resBody?.error === 'string') return left(resBody.error);

      if (res.ok) {
        return right(resBody);
      } else {
        return left(ErrorCodeEnum.requestFail);
      }
    } catch (transportOrParseError) {
      logger('apiClient#launderJsonResponse', transportOrParseError);

      return left(ErrorCodeEnum.httpFail);
    }
  }
}
