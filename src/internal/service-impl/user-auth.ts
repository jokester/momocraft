import { ApiResponse, ExposedAuthState, UserAuthService } from '../../service/all';
import { Either, fromOption, left, map as mapEither, right } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelfUser } from '../../model/user-identity';

import * as HttpApi from '../../model/http-api';
import { AuthResponse, EmailAuthPayload } from '../../model/http-api';

import { ApiClient } from './client';
import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '../../model/error-code';
import { toTypedLocalStorage } from '../../util/typed-local-storage';

interface InternalAuthState {
  identity: null | AuthResponse;
  pendingAuth: boolean;
}

const exposeAuthState = map<InternalAuthState, ExposedAuthState>((_: InternalAuthState) => ({
  pendingAuth: _.pendingAuth,
  self: _.identity?.self || null,
}));

export class AuthServiceImpl implements UserAuthService {
  constructor(private readonly apiClient: ApiClient) {}

  private readonly persist = toTypedLocalStorage<{
    moAur: AuthResponse;
  }>();

  private readonly _authState = new BehaviorSubject<InternalAuthState>({
    pendingAuth: false,
    identity: this.persist.getItem('moAur'),
  });

  get authed(): Observable<ExposedAuthState> {
    return this._authState.asObservable().pipe(exposeAuthState);
  }

  async emailSignUp(param: EmailAuthPayload): ApiResponse<SelfUser> {
    return this.onAuthResponse(await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignUp, {}, param));
  }

  async emailSignIn(param: EmailAuthPayload): ApiResponse<SelfUser> {
    return this.onAuthResponse(await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignIn, {}, param));
  }

  signOut(): Either<string, void> {
    if (this._authState.value.pendingAuth || !this._authState.value.identity) {
      return left('incorrect state');
    }
    this._authState.next({ identity: null, pendingAuth: false });
    return right(0 as never);
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

  private buildAuthHeader(): Either<string, Record<string, string>> {
    const last = this._authState.value;

    const token = last.identity?.jwtToken;

    return token ? right({ Authorization: `Bearer ${token}` }) : left(ErrorCodeEnum.notAuthenticated);
  }

  private onStartAuth = () => {
    this._authState.next({ ...this._authState.value, pendingAuth: true });
  };

  private onAuthResponse = mapEither<HttpApi.AuthResponse, SelfUser>(r => {
    this.persist.setItem('moAur', r);
    this._authState.next({ identity: r, pendingAuth: false });
    return r.self;
  });
}

export interface AuthTokenProvider {
  useAuthToken<A, B>(
    consumer: (authToken: string, isRetry: boolean) => Promise<Either<A, B>>,
    autoRefresh?: boolean,
  ): Promise<Either<A, B>>;
}
