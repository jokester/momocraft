import { left, right } from 'fp-ts/lib/Either';
import { deriveErrorMessage, ErrorCodeEnum } from '../../model/error-code';
import { createLogger } from '../../util/debug-logger';
import { ApiResponse } from '../../service/api-convention';
import { ErrorResponse } from '../../api/hanko-api';
import { buildApiRoute } from '../../api/api-route';
import { getOrElse } from 'fp-ts/lib/Option';

const logger = createLogger(__filename, false);

export class ApiClient {
  readonly route: ReturnType<typeof buildApiRoute>;
  constructor(private readonly _fetch: typeof fetch, apiOrigin: string) {
    this.route = buildApiRoute(apiOrigin);
  }

  getJson<T>(url: string, headers: Record<string, string>): ApiResponse<T> {
    return ApiClient.launderJsonResponse(this._fetch(url, { headers })).then(logger.tap) as ApiResponse<T>;
  }

  putJson<T>(url: string, headers: Record<string, string>, payload: object): ApiResponse<T> {
    return ApiClient.launderJsonResponse(
      this._fetch(url, {
        headers: {
          ...headers,
          'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    ).then(logger.tap) as ApiResponse<T>;
  }

  postJson<T>(url: string, headers: Record<string, string>, payload: object): ApiResponse<T> {
    return ApiClient.launderJsonResponse(
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

  private static async launderJsonResponse<T>(resP: Promise<Response>): ApiResponse<T> {
    try {
      const res = await resP;

      if (res.ok) {
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

      const derivedUserMessage = getOrElse(() => resBody?.message || 'Error')(deriveErrorMessage(resBody?.error));

      return left(derivedUserMessage);
    } catch (transportOrParseError) {
      logger('apiClient#launderJsonResponse', transportOrParseError);

      return left(ErrorCodeEnum.httpFail);
    }
  }
}
