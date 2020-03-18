import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EntropyService } from '../deps/entropy.service';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [UserService, EntropyService, DatabaseModule],
  exports: [UserService],
})
export class UserModule {}
