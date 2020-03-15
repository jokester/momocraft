import { Module } from '@nestjs/common';
import { typeoORMConnectionProvider } from './typeorm-connection.provider';

@Module({
  providers: [...typeoORMConnectionProvider],
  exports: [...typeoORMConnectionProvider],
})
export class DatabaseModule {}
