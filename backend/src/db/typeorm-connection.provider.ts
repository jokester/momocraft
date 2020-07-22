import { Connection, createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import path from 'path';

export const TypeORMConnection = Symbol('TYPEORM_CONNECTION');

export const typeORMConnectionProvider: FactoryProvider<Promise<Connection>> = {
  scope: Scope.DEFAULT,
  provide: TypeORMConnection,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createConnection({
      /** override to prevent typeorm from reading .env (which fails to resolve entities correctly) */
      type: configService.get('TYPEORM_CONNECTION'),
      url: configService.get('TYPEORM_URL'),
      entities: [path.join(__dirname, 'entities/*.ts'), path.join(__dirname, 'entities/*.js')],
      migrations: [path.join(__dirname, 'migrations/*.ts'), path.join(__dirname, 'migrations/*.js')],
      migrationsRun: true,
      migrationsTransactionMode: 'all',
      logger: 'debug',
    }),
};
