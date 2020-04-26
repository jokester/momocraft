import { Controller, Get, Header } from "@nestjs/common";
import { ResolvedUser, UserService } from "../user/user.service";
import { AuthedUser } from "../user/user-jwt-auth.middleware";
import { UserAccount } from "../db/entities/user-account";
import { getDebugLogger } from "../util/get-debug-logger";

const logger = getDebugLogger(__filename);

@Controller('momo/user')
export class MomoUserController {

  constructor(private readonly userService: UserService) {
  }

  @Get('self')
  @Header('Cache-Control', 'private;max-age=0;')
  async getSelf(@AuthedUser() authedUser: UserAccount): Promise<ResolvedUser> {
    logger('MomoUserController#getSelf', authedUser);

    return this.userService.resolveUser(authedUser);
  }

}
