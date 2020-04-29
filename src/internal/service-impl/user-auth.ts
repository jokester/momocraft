import { ApiResponse, ExposedAuthState, UserAuthService } from '../../service/all';
import { Either, fold, fromOption, left, map as mapEither, right } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelfUser } from '../../model/user-identity';

import * as HttpApi from '../../model/http-api';
import { AuthResponse, EmailAuthPayload } from '../../model/http-api';

import { ApiClient } from './client';
import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '../../model/error-code';
import { toTypedLocalStorage } from '../../util/typed-local-storage';
import { createLogger } from '../../util/debug-logger';

const logger = createLogger(__filename);

interface InternalAuthState {
  identity: null | AuthResponse;
  pendingAuth: boolean;
}

const exposeAuthState = map<InternalAuthState, ExposedAuthState>((_: InternalAuthState) => ({
  pendingAuth: _.pendingAuth,
  self: _.identity?.user || null,
}));

export class AuthServiceImpl implements UserAuthService {
  private readonly persist = toTypedLocalStorage<{
    moAur: AuthResponse;
  }>();

  private readonly _authState = new BehaviorSubject<InternalAuthState>({
    pendingAuth: false,
    identity: this.persist.getItem('moAur'),
  });

  constructor(private readonly apiClient: ApiClient) {
    logger('authState.init', this._authState.value);
    this._authState
      .pipe(_ => _)
      .subscribe({
        next(v) {
          logger('authState.next', v);
        },
        error(e) {
          logger('authState.error', e);
        },
      });
  }

  get authed(): Observable<ExposedAuthState> {
    return this._authState.pipe(exposeAuthState);
  }

  async emailSignUp(param: EmailAuthPayload): ApiResponse<SelfUser> {
    this.onStartAuth();
    const res = await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignUp, {}, param);
    return this.onAuthResponse(res);
  }

  async emailSignIn(param: EmailAuthPayload): ApiResponse<SelfUser> {
    this.onStartAuth();
    const res = await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignIn, {}, param);
    return this.onAuthResponse(res);
  }

  signOut(): Either<string, void> {
    if (this._authState.value.pendingAuth || !this._authState.value.identity) {
      return left('incorrect state');
    }
    this._authState.next({ identity: null, pendingAuth: false });
    this.persist.removeItem('moAur');
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

  private onAuthResponse = fold<string, HttpApi.AuthResponse, Either<string, SelfUser>>(
    l => {
      this._authState.next({ identity: null, pendingAuth: false });
      return left(l);
    },
    r => {
      this.persist.setItem('moAur', r);
      this._authState.next({ identity: r, pendingAuth: false });
      return right(r.user);
    },
  );
}

export interface AuthTokenProvider {
  useAuthToken<A, B>(
    consumer: (authToken: string, isRetry: boolean) => Promise<Either<A, B>>,
    autoRefresh?: boolean,
  ): Promise<Either<A, B>>;
}
