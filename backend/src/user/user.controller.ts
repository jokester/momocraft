import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ResolvedUser, UserService } from './user.service';
import { getRightOrThrow, getSomeOrThrow } from '../util/fpts-getter';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserAccount } from '../db/entities/user-account';

const logger = getDebugLogger(__filename);

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id/:shortId')
  async getUser(@Param() params: { shortId: string }): Promise<ResolvedUser> {
    logger('getUser params', params);

    const user = getSomeOrThrow(await this.userService.findByShortId(params.shortId), () => new NotFoundException());

    return this.userService.resolveUser(user);
  }

  @Get('self')
  @Header('Cache-Control', 'private;max-age=0;')
  async getSelf(@Headers('authorization') authHeader?: string): Promise<ResolvedUser> {
    logger('AuthController#jwtValidate auth', authHeader);
    const x = /^Bearer ([^ ]*)$/.exec(authHeader || '');

    if (!x) {
      throw new BadRequestException('malformed Authorization header');
    }
    const [_whatever, token] = x;

    const user = getRightOrThrow(await this.userService.findUserWithJwtToken(token), l => new UnauthorizedException(l));

    return this.userService.resolveUser(user);
  }

  @Put('self/meta')
  async putUserMeta(@Param() params: {}) {
    throw 'TODO';
  }
}
