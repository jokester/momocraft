import { UserAuthService } from '../../service/all';
import { Either, left } from 'fp-ts/lib/Either';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelfUser } from '../../model/user-identity';
import { none, Option } from 'fp-ts/lib/Option';
import { ApiClient } from './client';

interface AuthState {
  authToken: string;
  selfUser: SelfUser;
}

export class AuthServiceImpl implements UserAuthService {
  constructor(private readonly apiClient: ApiClient) {}

  private readonly _authState = new BehaviorSubject<Option<AuthState>>(none);

  get authState(): Observable<Option<AuthState>> {
    return this._authState.asObservable();
  }

  async useAuthToken<A, B>(consumer: (authToken: string) => Promise<Either<A, B>>): Promise<Either<A, B>> {
    return left(0 as never);
  }
}

export interface AuthTokenProvider {
  useAuthToken<A, B>(consumer: (authToken: string) => Promise<Either<A, B>>): Promise<Either<A, B>>;
}
