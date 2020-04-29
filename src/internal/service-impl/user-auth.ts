import { ApiResponse, UserAuthService } from '../../service/all';
import { Either, fromOption, left, map as mapEither } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelfUser } from '../../model/user-identity';
import { fromNullable, map as mapOpt, Option, some } from 'fp-ts/lib/Option';

import * as HttpApi from '../../model/http-api';
import { AuthResponse, EmailAuthPayload } from '../../model/http-api';

import { ApiClient } from './client';
import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '../../model/error-code';
import { toTypedLocalStorage } from '../../util/typed-local-storage';

interface InternalAuthState extends AuthResponse {
  authedAt: number;
}

const exposeAuthState = map(mapOpt((_: InternalAuthState) => _.self));

export class AuthServiceImpl implements UserAuthService {
  constructor(private readonly apiClient: ApiClient) {}

  private readonly persist = toTypedLocalStorage<{
    ias: InternalAuthState;
  }>();

  private readonly _authState = new BehaviorSubject<Option<InternalAuthState>>(
    fromNullable(this.persist.getItem('ias')),
  );

  get authed(): Observable<Option<SelfUser>> {
    return this._authState.asObservable().pipe(exposeAuthState);
  }

  async emailSignUp(param: EmailAuthPayload): ApiResponse<SelfUser> {
    return this.onAuthResponse(await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignUp, {}, param));
  }

  async emailSignIn(param: EmailAuthPayload): ApiResponse<SelfUser> {
    return this.onAuthResponse(await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignIn, {}, param));
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

  private buildAuthHeader(): Either<string, string> {
    const last = this._authState.value;
    return fromOption(() => ErrorCodeEnum.httpFail)(mapOpt<InternalAuthState, string>(_ => _.jwtToken)(last));
  }

  private onAuthResponse = mapEither<HttpApi.AuthResponse, SelfUser>(r => {
    const newState = { ...r, authedAt: Date.now() };
    this.persist.setItem('ias', newState);
    this._authState.next(some(newState));
    return r.self;
  });
}

export interface AuthTokenProvider {
  useAuthToken<A, B>(
    consumer: (authToken: string, isRetry: boolean) => Promise<Either<A, B>>,
    autoRefresh?: boolean,
  ): Promise<Either<A, B>>;
}
