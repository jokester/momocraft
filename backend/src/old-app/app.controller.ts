import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { getDebugLogger } from '../util/get-debug-logger';

const logger = getDebugLogger(__filename);
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    logger('AppController created');
  }

  @Get()
  getHello(): string {
    logger('AppController gethello');
    return this.appService.getHello();
  }
}
