import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RefreshTokenGuard } from '../../guards/refresh-token/refresh-token.guard';
import { UserJwtDataDto } from '../../dto/user-jwt-data.dto';
import { UserData } from '../../decorators/user-data/user-data.decorator';
import { RefreshTokenDecorator } from '../../decorators/jwt-tokens/refresh-token.decorator';
import { AccessTokenDto } from '../../dto/access-token.dto';
import { JwtTokensDto } from '../../dto/jwt-tokens.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('sign-up')
  async handleSignUp(@Payload() data: CreateUserDto): Promise<void> {
    return this.authService.signUp(data);
  }

  @MessagePattern('request login')
  async handleRequestLogin(@Payload() data: CreateUserDto): Promise<void> {
    return this.authService.requestLogin(data);
  }

  @MessagePattern('sign-in')
  async handleSignIn(@Payload() data: LinkDto): Promise<JwtTokensDto> {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @MessagePattern('refresh')
  async handleRefresh(
    @UserData() data: UserJwtDataDto,
  ): Promise<AccessTokenDto> {
    return this.authService.refresh(data);
  }

  @MessagePattern('logout')
  async handleLogout(@RefreshTokenDecorator() token: string): Promise<void> {
    return this.authService.logout(token);
  }

  @MessagePattern('forgot-password')
  async handleForgotPassword(@Payload() email: string): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @MessagePattern('set-new-password')
  async handleSetNewPassword(@Payload() data: SetNewPasswordDto) {
    return this.authService.setNewPassword(data);
  }
}
