import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getDebugLogger } from '../util/get-debug-logger';

const logger = getDebugLogger(__filename);
@Injectable()
export class UserJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const x = context.switchToHttp().getRequest<Request>();
    return true;
  }
}
