import { ApiResponse } from '../../service/api-convention';
import { Either, fold, left, right } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';

import * as HttpApi from '../../api/hanko-api';
import { AuthResponse, EmailAuthPayload, HankoUser } from '../../api/hanko-api';

import { ApiClient } from './client';
import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '../../model/error-code';
import { toTypedLocalStorage } from '../../util/typed-local-storage';
import { createLogger } from '../../util/debug-logger';
import { AuthService, ExposedAuthState } from '../../service/auth-service';
import { isDevBuild } from '../../config/build-env';

const logger = createLogger(__filename);

interface InternalAuthState {
  identity: null | AuthResponse;
  pendingAuth: boolean;
}

const exposeAuthState = map<InternalAuthState, ExposedAuthState>((_: InternalAuthState) => ({
  pendingAuth: _.pendingAuth,
  user: _.identity?.user,
  profile: null,
}));

export class AuthServiceImpl implements AuthService {
  private readonly persist = toTypedLocalStorage<{
    moAur: AuthResponse;
  }>();

  private readonly _authState = new BehaviorSubject<InternalAuthState>({
    pendingAuth: false,
    identity: this.persist.getItem('moAur'),
  });

  constructor(private readonly apiClient: ApiClient) {
    logger('authState.init', this._authState.value);

    if (isDevBuild) {
      this._authState.subscribe({
        next(v) {
          logger('authState.next', v);
        },
        error(e) {
          logger('authState.error', e);
        },
      });
    }
  }

  get authed(): Observable<ExposedAuthState> {
    return this._authState.pipe(exposeAuthState);
  }

  async emailSignUp(param: EmailAuthPayload): ApiResponse<HankoUser> {
    this.onStartAuth();
    const res = await this.c.postJson<HttpApi.AuthResponse>(this.r.hankoAuth.emailSignUp, {}, param);
    return this.onAuthResponse(res);
  }

  async emailSignIn(param: EmailAuthPayload): ApiResponse<HankoUser> {
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

  async withAuthedIdentity<T>(
    consumer: (
      currentUser: HankoUser,
      authHeader: Record<string, string>,
      isRetry: boolean,
    ) => Promise<Either<string, T>>,
    authRefresh = false,
  ): Promise<Either<string, T>> {
    const identity = this._authState.value.identity;

    if (identity) {
      // TODO: should support token refresh / retry
      return consumer(identity.user, buildAuthHeader(identity.jwtToken), false);
    }

    return left(ErrorCodeEnum.notAuthenticated);
  }

  private get c() {
    return this.apiClient;
  }
  private get r() {
    return this.apiClient.route;
  }

  private onStartAuth = () => {
    this._authState.next({ ...this._authState.value, pendingAuth: true });
  };

  private onAuthResponse = fold<string, HttpApi.AuthResponse, Either<string, HankoUser>>(
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

function buildAuthHeader(jwtToken: string): Record<string, string> {
  return { Authorization: `Bearer ${jwtToken}` };
}
