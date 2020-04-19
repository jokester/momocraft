import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EntropyService } from '../deps/entropy.service';
import { DatabaseModule } from '../db/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { absent } from '../util/absent';
import { AuthController } from './auth.controller';
import { GoogleOAuthService } from './google-oauth.service';

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
  controllers: [UserController, AuthController],
  providers: [EntropyService, UserService, GoogleOAuthService],
  exports: [UserService],
})
export class UserModule {}
