import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getDebugLogger } from './util/get-debug-logger';

const debug = getDebugLogger(__filename);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const conf = await app.get(ConfigService);

  const port = parseInt(conf.get('LISTEN_PORT') || '0');
  debug('parsed config: port=%d', port);

  await app.listen(port);
}
bootstrap();
