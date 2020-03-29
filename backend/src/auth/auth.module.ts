import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { GoogleOAuthService } from './google-oauth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [GoogleOAuthService],
  exports: [],
})
export class AuthModule {}
