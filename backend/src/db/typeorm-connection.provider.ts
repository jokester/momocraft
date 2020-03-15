import { createConnection } from 'typeorm';
import { Photo } from './entities/photo';
import { ConfigService } from '@nestjs/config';

export const TypeORMConnection = Symbol('TYPEORM_CONNECTION');

export const typeoORMConnectionProvider = [
  {
    provide: TypeORMConnection,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      createConnection({
        /** override to prevent typeorm from reading .env (which fails to resolve entities correctly) */
        type: configService.get('TYPEORM_CONNECTION'),
        url: configService.get('TYPEORM_URL'),
        entities: [Photo],
      }),
  },
];
