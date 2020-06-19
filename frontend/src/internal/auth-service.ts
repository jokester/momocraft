import { ApiResponse, ApiError } from '../api/api-convention';
import { Either, fold, left, right } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '../const-shared/error-code';
import { toTypedLocalStorage } from '../util/typed-local-storage';
import { createLogger } from '../util/debug-logger';
import { isDevBuild } from '../const/build-env';
import { ApiProvider } from '../api/bind-api';
import { launderResponse } from '../api/launder-api-response';
import { EmailAuthRequestDto, OAuthRequestDto } from '../api-generated/models';
import { UserProfileDto, AuthedSessionDto } from '../api-generated/models';

const logger = createLogger(__filename);

export interface ExposedAuthState {
  user?: UserProfileDto;
  profile: null;
  pendingAuth: boolean;
}

interface InternalAuthState {
  identity: null | AuthedSessionDto;
  pendingAuth: boolean;
}

const exposeAuthState = map<InternalAuthState, ExposedAuthState>((_: InternalAuthState) => ({
  pendingAuth: _.pendingAuth,
  user: _.identity?.user,
  profile: null,
}));

export class AuthServiceImpl {
  private readonly persist = toTypedLocalStorage<{
    moAur: AuthedSessionDto;
  }>();

  private readonly _authState = new BehaviorSubject<InternalAuthState>({
    pendingAuth: false,
    identity: this.persist.getItem('moAur'),
  });

  constructor(
    private readonly useApi: ApiProvider,

    refreshSession: boolean,
  ) {
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

    if (this._authState.value.identity && refreshSession) {
      setTimeout(() => this.refreshSession());
    }
  }

  get authed(): Observable<ExposedAuthState> {
    return this._authState.pipe(exposeAuthState);
  }

  async emailSignUp(param: EmailAuthRequestDto): ApiResponse<UserProfileDto> {
    if (this.hasPendingAuth) return left(ErrorCodeEnum.maxConcurrencyExceeded);
    this.onStartAuth();
    const res = await launderResponse(this.useApi().authControllerDoEmailSignUpRaw({ emailAuthRequestDto: param }));
    return this.onAuthResponse(res);
  }

  async emailSignIn(param: EmailAuthRequestDto): ApiResponse<UserProfileDto> {
    if (this.hasPendingAuth) return left(ErrorCodeEnum.maxConcurrencyExceeded);
    this.onStartAuth();
    const res = await launderResponse(this.useApi().authControllerDoEmailSignInRaw({ emailAuthRequestDto: param }));
    return this.onAuthResponse(res);
  }

  async oAuthSignIn(param: OAuthRequestDto): ApiResponse<UserProfileDto> {
    // if (this.hasPendingAuth) return left(ErrorCodeEnum.maxConcurrencyExceeded);
    this.onStartAuth();
    const res = await launderResponse(this.useApi().authControllerDoDiscordOAuthRaw({ oAuthRequestDto: param }));
    return this.onAuthResponse(res);
  }

  private async refreshSession() {
    if (this.hasPendingAuth) return left(ErrorCodeEnum.maxConcurrencyExceeded);
    this.onStartAuth();
    const res = await launderResponse(this.useApi().authControllerDoRefreshTokenRaw());
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
      currentUser: UserProfileDto,
      authHeader: Record<string, string>,
      isRetry: boolean,
    ) => Promise<Either<ApiError, T>>,
    authRefresh = false,
  ): Promise<Either<ApiError, T>> {
    const identity = this._authState.value.identity;

    if (identity) {
      // TODO: should support token refresh / retry
      return consumer(identity.user, buildAuthHeader(identity.jwtToken), false);
    }

    return left(ErrorCodeEnum.notAuthenticated);
  }

  private get hasPendingAuth() {
    return !!this._authState.value.identity;
  }

  private onStartAuth = () => {
    this._authState.next({ ...this._authState.value, pendingAuth: true });
  };

  private onAuthResponse = fold<ApiError, AuthedSessionDto, Either<ApiError, UserProfileDto>>(
    (l) => {
      this._authState.next({ identity: null, pendingAuth: false });
      return left(l);
    },
    (r) => {
      this.persist.setItem('moAur', r);
      this._authState.next({ identity: r, pendingAuth: false });
      return right(r.user);
    },
  );
}

/**
 * TODO: sync with AuthServiceImpl
 */
export interface AuthTokenProvider {
  useAuthToken<A, B>(
    consumer: (authToken: string, isRetry: boolean) => Promise<Either<A, B>>,
    autoRefresh?: boolean,
  ): Promise<Either<A, B>>;
}

function buildAuthHeader(jwtToken: string): Record<string, string> {
  return { Authorization: `Bearer ${jwtToken}` };
}
