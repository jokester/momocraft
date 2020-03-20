import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EntropyService } from '../deps/entropy.service';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EntropyService, UserService],
  exports: [UserService],
})
export class UserModule {}
