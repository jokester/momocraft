import { MiddlewareConsumer, Module, RequestMethod, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { EntropyService } from '../deps/entropy.service';
import { DatabaseModule } from '../db/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { absent } from '../util/absent';
import { typeORMConnectionProvider } from '../db/typeorm-connection.provider';
import { UserJwtAuthMiddleware } from './user-jwt-auth.middleware';
import { UserController } from './user.controller';

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
  controllers: [UserController],
  providers: [UserService, EntropyService, typeORMConnectionProvider],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserJwtAuthMiddleware).forRoutes({ path: '/user/@me', method: RequestMethod.ALL });
  }
}
