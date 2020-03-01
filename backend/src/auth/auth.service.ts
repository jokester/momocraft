import { Injectable } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';

@Injectable()
export class AuthService {
  constructor() {
    getDebugLogger(__filename)('authService created');
  }

  touch() {
    getDebugLogger(__filename)('authService touched');
  }
}
