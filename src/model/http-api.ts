import { SelfUser } from './user-identity';

export interface EmailAuthPayload {
  email: string;
  password: string;
}

/**
 * TODO: align with hanko/momocraft-backend
 */
export interface AuthResponse {
  jwtToken: string;
  user: SelfUser;
}

// matches nestjs builtin exception response
export interface ErrorResponse {
  // http-errors
  statusCode: number;
  error?: string;

  // app-errors
  message: string;
}
