import { Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserProfileDto } from '../model/user-profile.dto';
import { AuthedUser } from './user-jwt-auth.middleware';
import { UserAccount } from '../db/entities/user-account';
import { getSomeOrThrow } from '../util/fpts-getter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('@me')
  @ApiOkResponse({ type: UserProfileDto })
  async getOwnProfile(@AuthedUser() authedUser: UserAccount): Promise<UserProfileDto> {
    return this.userService.resolveUser(authedUser);
  }

  @Get(':userId')
  @ApiOkResponse({ type: UserProfileDto })
  async getUserProfile(@Param('userId') userId: string): Promise<UserProfileDto> {
    const user = getSomeOrThrow(
      await this.userService.findUser({ userId }),
      () => new NotFoundException('user not found'),
    );
    return this.userService.resolveUser(user);
  }
}
