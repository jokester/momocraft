import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
