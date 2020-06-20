import { ApiError, ApiResponse, ApiResponseSync } from '../api/api-convention';
import { Either, isLeft, isRight, left, map as mapEither, right } from 'fp-ts/lib/Either';
import { BehaviorSubject, ConnectableObservable, from, Observable, ReplaySubject } from 'rxjs';

import { first, map, multicast, startWith, switchMap } from 'rxjs/operators';
import { ErrorCodeEnum } from '../const-shared/error-code';
import { toTypedLocalStorage } from '../util/typed-local-storage';
import { createLogger } from '../util/debug-logger';
import { isDevBuild } from '../const/build-env';
import { ApiProvider } from '../api/bind-api';
import { launderResponse } from '../api/launder-api-response';
import { AuthedSessionDto, EmailAuthRequestDto, OAuthRequestDto, UserProfileDto } from '../api-generated/models';
import { createDebugObserver } from '../util/rx/debug-observer';

const logger = createLogger(__filename);

const exposeAuthState = mapEither<AuthedSessionDto, UserProfileDto>((_) => _.user);

export class AuthServiceImpl {
  private readonly persist = toTypedLocalStorage<{
    moAur: AuthedSessionDto;
  }>();

  private readonly authAttempts = new BehaviorSubject<ApiResponse<AuthedSessionDto>>(
    Promise.resolve(left(ErrorCodeEnum.notAuthenticated)),
  );

  private readonly internalAuthState: ConnectableObservable<null | ApiResponseSync<AuthedSessionDto>>;

  constructor(private readonly useApi: ApiProvider, refreshSessionOnStart: boolean) {
    const internalAuthStateSubject = new ReplaySubject<null | ApiResponseSync<AuthedSessionDto>>(1);
    this.internalAuthState = this.authAttempts.pipe(
      switchMap((neverReject) => from(neverReject).pipe(startWith(null))),
      multicast(internalAuthStateSubject),
    ) as ConnectableObservable<null | ApiResponseSync<AuthedSessionDto>>;

    this.internalAuthState.subscribe((latest) => {
      if (latest) {
        if (isLeft(latest)) {
          this.persist.removeItem('moAur');
        } else {
          this.persist.setItem('moAur', latest.right);
        }
      }
    });

    if (isDevBuild) {
      this.authAttempts.subscribe(createDebugObserver(__filename, 'authAttempts'));
      this.internalAuthState.subscribe(createDebugObserver(__filename, 'internalAuthState'));
    }

    const revivedAuth = this.persist.getItem('moAur');
    if (refreshSessionOnStart && revivedAuth?.jwtToken) {
      this.refreshSession(revivedAuth.jwtToken);
    }

    this.internalAuthState.connect();
  }

  get authed(): Observable<null | ApiResponseSync<UserProfileDto>> {
    return this.internalAuthState.pipe(
      map(
        (maybeState) =>
          maybeState && mapEither<AuthedSessionDto, UserProfileDto>((_: AuthedSessionDto) => _.user)(maybeState),
      ),
    );
  }

  async emailSignUp(param: EmailAuthRequestDto): ApiResponse<UserProfileDto> {
    return this.replaceSession(
      launderResponse(this.useApi().authControllerDoEmailSignUpRaw({ emailAuthRequestDto: param })),
    );
  }

  async emailSignIn(param: EmailAuthRequestDto): ApiResponse<UserProfileDto> {
    return this.replaceSession(
      launderResponse(this.useApi().authControllerDoEmailSignInRaw({ emailAuthRequestDto: param })),
    );
  }

  async oDiscordAuthSignIn(param: OAuthRequestDto): ApiResponse<UserProfileDto> {
    const res = launderResponse(this.useApi().authControllerDoDiscordOAuthRaw({ oAuthRequestDto: param }));
    return this.replaceSession(res);
  }

  private refreshSession(jwtToken: string) {
    const res = launderResponse(this.useApi(buildAuthHeader(jwtToken)).authControllerDoRefreshTokenRaw());
    this.replaceSession(res);
  }

  signOut(): Either<string, void> {
    this.authAttempts.next(Promise.resolve(left(ErrorCodeEnum.notAuthenticated)));
    return right(undefined);
  }

  async withAuthedIdentity<T>(
    consumer: (
      currentUser: UserProfileDto,
      authHeader: Record<string, string>,
      isRetry: boolean,
    ) => Promise<Either<ApiError, T>>,
    /* TODO support this flag */ authRefresh = false,
  ): Promise<Either<ApiError, T>> {
    const identity = await this.internalAuthState.pipe(first()).toPromise();

    if (identity && isRight(identity)) {
      return consumer(identity.right.user, buildAuthHeader(identity.right.jwtToken), false);
    }

    return identity || left(ErrorCodeEnum.notAuthenticated);
  }

  private replaceSession(res: ApiResponse<AuthedSessionDto>): ApiResponse<UserProfileDto> {
    this.authAttempts.next(res);
    return res.then(exposeAuthState);
  }
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
