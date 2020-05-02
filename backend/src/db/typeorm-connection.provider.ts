import { Connection, createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { UserAccount } from './entities/user-account';
import { OAuthAccount } from './entities/oauth-account';
import { UserItemCollection } from './entities/user-item-collection';

export const TypeORMConnection = Symbol('TYPEORM_CONNECTION');

export const typeORMConnectionProvider: FactoryProvider<Promise<Connection>> = {
  provide: TypeORMConnection,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createConnection({
      /** override to prevent typeorm from reading .env (which fails to resolve entities correctly) */
      type: configService.get('TYPEORM_CONNECTION'),
      url: configService.get('TYPEORM_URL'),
      entities: [UserAccount, OAuthAccount, UserItemCollection],
    }),
};
