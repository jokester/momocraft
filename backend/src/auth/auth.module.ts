import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { GoogleOAuthService } from './google-oauth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleOAuthService],
  exports: [],
})
export class AuthModule {}
