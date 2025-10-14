import {Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Payload } from '@nestjs/microservices';
import { RefreshTokenDecorator } from '../../decorators/jwt-tokens/refresh-token.decorator';
import {JwtGuard} from "../../guards/jwt/jwt.guard";
import {SignUserDto} from "../../dto/sign-user.dto";
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async handleSignUp(@Payload() data: SignUserDto, @Res() res: Response) {
    return this.authService.signUp(data,res);
  }

  @Post('sign-in')
  async handleSignIn(@Payload() data: SignUserDto, @Res() res: Response) {
    return this.authService.signIn(data, res);
  }

  @Post('refresh')
  async handleRefresh(
      @Res() res: Response,
    @RefreshTokenDecorator() refreshToken: string,
  ) {
    return this.authService.refresh(refreshToken, res);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async handleLogout(@RefreshTokenDecorator() token: string, @Res() res: Response) {
    return this.authService.logout(token, res);
  }

  @Post('forgot-password')
  async handleForgotPassword(@Payload() email: string): Promise<void> {
    return this.authService.forgotPassword(email);
  }
}
