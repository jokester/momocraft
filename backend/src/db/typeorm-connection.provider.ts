import { Connection, createConnection } from 'typeorm';
import { Photo } from './entities/photo';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { UserAccount } from './entities/user-account';
import { OAuthAccount } from './entities/oauth-account';

export const TypeORMConnection = Symbol('TYPEORM_CONNECTION');

export const typeORMConnectionProvider: FactoryProvider<Promise<Connection>> = {
  provide: TypeORMConnection,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createConnection({
      /** override to prevent typeorm from reading .env (which fails to resolve entities correctly) */
      type: configService.get('TYPEORM_CONNECTION'),
      url: configService.get('TYPEORM_URL'),
      entities: [Photo, UserAccount, OAuthAccount],
    }),
};
