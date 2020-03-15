import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
