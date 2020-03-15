import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PgDatabaseService } from './pg-database.service';

@Module({
  providers: [UserService, PgDatabaseService],
  exports: [UserService],
})
export class UserModule {}
