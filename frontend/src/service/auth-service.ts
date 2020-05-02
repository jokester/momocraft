import { Observable } from 'rxjs';
import { EmailAuthPayload, HankoUser } from '../api/hanko-api';
import { Either } from 'fp-ts/lib/Either';
import { ApiResponse } from './api-convention';

export interface ExposedAuthState {
  user?: HankoUser;
  profile: null;
  pendingAuth: boolean;
}

export interface AuthService {
  authed: Observable<ExposedAuthState>;

  emailSignUp(param: EmailAuthPayload): ApiResponse<HankoUser>;

  emailSignIn(param: EmailAuthPayload): ApiResponse<HankoUser>;

  signOut(): Either<string, void>;
}
