import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getDebugLogger } from './util/get-debug-logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const debug = getDebugLogger(__filename);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const conf = await app.get(ConfigService);

  const port = parseInt(conf.get('LISTEN_PORT') || '0');
  debug('parsed config: port=%d', port);

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder().setTitle('Momocraft Api').addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(port);
}
bootstrap();
