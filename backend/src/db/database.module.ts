import { Module } from '@nestjs/common';
import { typeORMConnectionProvider } from './typeorm-connection.provider';

@Module({
  providers: [typeORMConnectionProvider],
  exports: [typeORMConnectionProvider],
})
export class DatabaseModule {}
