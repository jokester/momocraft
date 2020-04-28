import { ApiResponse, EmailAuthPayload, UserAuthService } from '../../service/all';
import { Either, left, map as mapEither } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelfUser } from '../../model/user-identity';
import { none, Option, map as mapOpt, option, alt as optionAlt } from 'fp-ts/lib/Option';

import { ApiClient } from './client';
import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '../../model/error-code';

interface InternalAuthState {
  authToken: string;
  selfUser: SelfUser;
}

const exposeAuthState = map(mapOpt((_: InternalAuthState) => _.selfUser));

export class AuthServiceImpl implements UserAuthService {
  constructor(private readonly apiClient: ApiClient) {}

  private readonly _authState = new BehaviorSubject<Option<InternalAuthState>>(none);

  get authed(): Observable<Option<SelfUser>> {
    return this._authState.asObservable().pipe(exposeAuthState);
  }

  async emailSignUp(param: EmailAuthPayload): ApiResponse<SelfUser> {
    const signupRes = await this.c.postJson<{}>(this.r.hankoAuth.emailSignUp, {}, param);

    return mapEither(r => {
      // this._authState.next(r.)

      return r;
    })(signupRes);
  }

  async useAuthToken<T>(
    consumer: (authToken: string, isRetry: boolean) => Promise<Either<string, T>>,
    authRefresh = true,
  ): Promise<Either<string, T>> {
    return left(ErrorCodeEnum.notImplemented);
  }

  private get c() {
    return this.apiClient;
  }
  private get r() {
    return this.apiClient.route;
  }
}

export interface AuthTokenProvider {
  useAuthToken<A, B>(
    consumer: (authToken: string, isRetry: boolean) => Promise<Either<A, B>>,
    autoRefresh?: boolean,
  ): Promise<Either<A, B>>;
}
