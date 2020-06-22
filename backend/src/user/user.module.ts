import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { EntropyService } from '../deps/entropy.service';
import { DatabaseModule } from '../db/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { absent } from '../util/absent';
import { AuthController } from './auth.controller';
import { GoogleOAuthService } from './google-oauth.service';
import { UserJwtAuthMiddleware } from './user-jwt-auth.middleware';
import { DiscordOAuth, GoogleOAuth } from './oauth-client.provider';
import { DiscordOAuthService } from './discord-oauth.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigService,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET') ?? absent('$JWT_SECRET'),
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    GoogleOAuthService,
    EntropyService,
    DiscordOAuth.Provider,
    DiscordOAuthService,
    GoogleOAuth.Provider,
    GoogleOAuthService,
  ],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserJwtAuthMiddleware).forRoutes({ path: '/user/self', method: RequestMethod.ALL });
  }
}
