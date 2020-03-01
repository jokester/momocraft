import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('email/signin')
  async emailSignIn(@Request() req: Request & { user?: UserEntity }): Promise<UserEntity | null> {
    return req.user || null;
  }

  @Post('google/oauth')
  async startGoogleOAuth() {}
}
