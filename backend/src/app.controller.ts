import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { getDebugLogger } from './util/get-debug-logger';
import { AuthService } from './auth/auth.service';

const logger = getDebugLogger(__filename);
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {
    logger('AppController created');
  }

  @Get()
  getHello(): string {
    logger('AppController gethello');
    this.authService.touch();
    return this.appService.getHello();
  }
}
