import * as ApiRuntime from '../api-generated/runtime';
import { ApiResponse } from './api-convention';
import { left, right } from 'fp-ts/lib/Either';
import { ErrorCodeEnum, isErrorCodeEnum } from '../../const-shared/error-code';
import { ApiErrorDto } from '../api-generated';

export async function launderResponse<T>(
  resP: ApiRuntime.ApiResponse<T> | PromiseLike<ApiRuntime.ApiResponse<T>>,
): ApiResponse<T> {
  let gotWholeResponse = false;
  try {
    const res = await (await resP).value();
    gotWholeResponse = true;
    return right(res);
  } catch (fail) {
    if (fail instanceof Response) {
      // openapi-generator throws on statusCode outside [200, 300)
      const resBody: ApiErrorDto = await fail.json();
      gotWholeResponse = true;
      if (isErrorCodeEnum(resBody?.error)) {
        return left(resBody.error);
      }
      switch (fail.status) {
        case 401:
          return left(ErrorCodeEnum.notAuthenticated);
        case 403:
          return left(ErrorCodeEnum.forbidden);
      }
    }
    return left(ErrorCodeEnum.internalError);
  } finally {
    // for possible error in catch {}
    if (!gotWholeResponse) {
      return left(ErrorCodeEnum.httpFail);
    }
  }
}
