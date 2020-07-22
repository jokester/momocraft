import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DiscordOAuth, GoogleOAuth } from './oauth-client.provider';
import { DiscordOAuthService } from './discord-oauth.service';
import { GoogleOAuthService } from './google-oauth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [DiscordOAuth.Provider, DiscordOAuthService, GoogleOAuth.Provider, GoogleOAuthService],
})
export class AuthModule {}
