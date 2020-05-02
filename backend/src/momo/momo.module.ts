import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { UserModule } from '../user/user.module';
import { MomoUserController } from './momo-user.controller';
import { UserJwtAuthMiddleware } from '../user/user-jwt-auth.middleware';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [MomoUserController],
  providers: [],
})
export class MomoModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserJwtAuthMiddleware).forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
