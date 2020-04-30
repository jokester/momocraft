import { Observable } from 'rxjs';
import { EmailAuthPayload, HankoUser } from '../api/hanko-api';
import { Either } from 'fp-ts/lib/Either';
import { ApiResponse } from './all';

export interface ExposedAuthState {
  user?: HankoUser;
  profile: null;
  pendingAuth: boolean;
}

export interface UserAuthService {
  authed: Observable<ExposedAuthState>;

  emailSignUp(param: EmailAuthPayload): ApiResponse<HankoUser>;

  emailSignIn(param: EmailAuthPayload): ApiResponse<HankoUser>;

  signOut(): Either<string, void>;
}
