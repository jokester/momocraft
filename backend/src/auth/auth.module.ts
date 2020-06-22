import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DiscordOAuth, GoogleOAuth } from '../user/oauth-client.provider';
import { DiscordOAuthService } from '../user/discord-oauth.service';
import { GoogleOAuthService } from '../user/google-oauth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [DiscordOAuth.Provider, DiscordOAuthService, GoogleOAuth.Provider, GoogleOAuthService],
})
export class AuthModule {}
