import { Inject, Injectable } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../../config/jwt.config';
import appConfig from '../../../config/app.config';
import { ConfigType } from '@nestjs/config';
import { KEYS } from '../../../constants/constants';
import { JwtTokensDto } from '../../../dto/jwt-tokens.dto';
import { UserJwtDataDto } from '../../../dto/user-jwt-data.dto';
import { JwtPayload } from '../../../dto/jwt-payload.dto';
import { AccessTokenDto } from '../../../dto/access-token.dto';

@Injectable()
export class JwtAuthService {
  private readonly privateKey: Buffer;
  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>,
  ) {
    const env = appConf.node_env || 'development';
    this.privateKey = fs.readFileSync(
      path.join(__dirname, `../../../config/keys/${KEYS[env].private_key}`),
    );
  }

  generateTokens(payload: UserJwtDataDto): JwtTokensDto {
    return {
      refreshToken: this.generateRefreshToken({ sub: payload.sub }),
      accessToken: this.generateAccessToken(payload),
    };
  }

  getAccessToken(payload: UserJwtDataDto): AccessTokenDto {
    return { accessToken: this.generateAccessToken(payload) };
  }

  async verifyAsync(token: string) {
    return (await this.jwtService.verifyAsync(token)) as JwtPayload;
  }

  private generateRefreshToken(payload: UserJwtDataDto): string {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: this.privateKey,
      expiresIn: this.jwtConf.refreshExpiresIn,
      issuer: this.jwtConf.issuer,
    });
  }

  private generateAccessToken(payload: UserJwtDataDto): string {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: this.privateKey,
      expiresIn: this.jwtConf.expiresIn,
      issuer: this.jwtConf.issuer,
    });
  }
}
