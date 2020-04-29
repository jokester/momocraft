export interface EmailAuthPayload {
  email: string;
  password: string;
}

export interface HankoUser {
  userId: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  jwtToken: string;
  user: HankoUser;
}

// matches nestjs builtin exception response
export interface ErrorResponse {
  // http-errors
  statusCode: number;
  error?: string;

  // app-errors
  message: string;
}
