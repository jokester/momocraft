import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ResolvedUser, UserService } from './user.service';
import { getSomeOrThrow } from '../util/fpts-getter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':shortId')
  async getUser(@Param() params: { shortId: string }): Promise<ResolvedUser> {
    const user = getSomeOrThrow(await this.userService.findByShortId(params.shortId), () => new NotFoundException());

    return this.userService.resolveUser(user);
  }
}
