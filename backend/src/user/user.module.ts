import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EntropyService } from '../deps/entropy.service';
import { DatabaseModule } from '../db/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigService,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  providers: [EntropyService, UserService],
  exports: [UserService],
})
export class UserModule {}
