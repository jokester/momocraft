import * as ApiRuntime from '../api-generated/runtime';
import { ApiResponse } from './api-convention';
import { left, right } from 'fp-ts/lib/Either';
import { createLogger } from '../util/debug-logger';
import { ErrorCodeEnum, deriveErrorMessage, isErrorCodeEnum } from '../const-shared/error-code';
import { getOrElse } from 'fp-ts/lib/Option';
import { ApiErrorDto } from '../api-generated/models';

const logger = createLogger(__filename, false);

export async function launderResponse<T>(
  resP: ApiRuntime.ApiResponse<T> | PromiseLike<ApiRuntime.ApiResponse<T>>,
): ApiResponse<T> {
  try {
    const res = await resP;
    if (res.raw.ok) {
      return right(await res.value());
    }

    switch (res.raw.status) {
      case 401:
        return left(ErrorCodeEnum.notAuthenticated);
      case 403:
        return left(ErrorCodeEnum.forbidden);
    }

    const resBody = ((await res.value()) as unknown) as ApiErrorDto;

    if (isErrorCodeEnum(resBody?.error)) {
      return left(resBody.error);
    }
    return left(ErrorCodeEnum.internalError);

    // FIXME: think about how to generate error message
    const xx = getOrElse(() => resBody?.message || 'Error')(deriveErrorMessage(resBody?.error));

    return left({ message: xx });
  } catch (transportOrParseError) {
    return left(ErrorCodeEnum.httpFail);
  }
}
