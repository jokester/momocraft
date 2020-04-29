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
  self: SelfUser;
}

// matches nestjs builtin exception response
export interface ErrorResponse {
  // http-errors
  statusCode: number;
  message: string;

  // app-errors
  error?: string | string[];
}
