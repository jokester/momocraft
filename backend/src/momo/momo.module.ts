import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { MomoUserController } from './momo-user.controller';
import { UserJwtAuthMiddleware } from '../user/user-jwt-auth.middleware';
import { UserCollectionService } from './user-collection.service';
import { UserFriendService } from './user-friend.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [MomoUserController],
  providers: [UserCollectionService, UserFriendService],
})
export class MomoModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserJwtAuthMiddleware).forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
