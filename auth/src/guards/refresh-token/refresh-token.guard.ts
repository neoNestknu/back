import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserJwtDataDto } from '../../dto/user-jwt-data.dto';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const data = ctx.switchToRpc().getData();
    const refreshToken: string = data?.refreshToken?.replace('Bearer ', '');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    try {
      ctx.switchToRpc().getContext().user = (await this.jwtService.verifyAsync(
        refreshToken,
      )) as UserJwtDataDto;
      return true;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
