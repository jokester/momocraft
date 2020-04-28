import { Either, left, right } from 'fp-ts/lib/Either';
import { ErrorCodeEnum } from '../../model/error-code';
import { createLogger } from '../../util/debug-logger';

const logger = createLogger(__filename);

export class ApiClient {
  readonly route: ReturnType<typeof buildApiRoute>;
  constructor(private readonly _fetch: typeof fetch, apiOrigin: string) {
    this.route = buildApiRoute(apiOrigin);
  }

  getJson<T>(url: string, headers: {}): Promise<Either<string, T>> {
    return this.launderJsonResponse(this._fetch(url, { headers }));
  }

  postJson<T>(url: string, headers: {}, payload: object) {
    return this.launderJsonResponse(
      this._fetch(url, {
        headers,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  }

  private async launderJsonResponse<T>(resP: Promise<Response>): Promise<Either<string, T>> {
    try {
      const res = await resP;

      // TODO: detect http status
      if (!res.ok) return left(ErrorCodeEnum.requestFail);

      // assuming non-empty resBody
      const resBody: T & { error?: string | string[] } = await res.json();

      if (typeof resBody?.error === 'string') return left(resBody.error);
      if (resBody?.error instanceof Array) return left(resBody.error[0] || ErrorCodeEnum.requestFail);

      return right(resBody);
    } catch (transportOrParseError) {
      logger('apiClient#launderJsonResponse', transportOrParseError);

      return left(ErrorCodeEnum.httpFail);
    }
  }
}

/**
 * TODO: move to hanko
 * @param {string} apiOrigin
 */
const buildApiRoute = (apiOrigin: string) =>
  ({
    hankoUser: {
      show: (id: string) => `/user/id/${encodeURIComponent(id)}`,
      self: `/user/self`,
    },
    hankoAuth: {
      emailSignUp: `/auth/email/signup`,
      emailSignIn: `/auth/email/signin`,
      oauthGoogle: `/auth/oauth/google`,
    },

    // TODO: xxx
  } as const);
