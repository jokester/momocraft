import { UserProfileDto } from './user-profile.dto';

export class AuthedSessionDto {
  jwtToken!: string;
  user!: UserProfileDto;
}

export class OAuthGoogleRequestDto {
  code!: string;
  redirectUrl!: string;
}

export class EmailAuthRequestDto {
  email!: string;
  password!: string;
}
