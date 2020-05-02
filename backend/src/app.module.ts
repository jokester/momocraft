import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MomoModule } from './momo/momo.module';
import { EntropyService } from './deps/entropy.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), UserModule, MomoModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
