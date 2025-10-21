import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import jwtConfig from "../../../config/jwt.config";
import appConfig from "../../../config/app.config";
import {KEYS} from "../../../constants/constants";
import {UserJwtDataDto} from "../../../dto/user-jwt-data.dto";

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
    this.privateKey = fs.readFileSync(
      path.join(
        __dirname,
        `../../config/key/${KEYS[this.appConf.node_env].private_key}`,
      ),
    );
  }

  generateTokens(payload: UserJwtDataDto) {
    return {
      refreshToken: this.generateRefreshToken({ sub: payload.sub }),
      accessToken: this.generateAccessToken(payload),
    };
  }

  generateShortLiveToken() {
    return {
      token: this.jwtService.sign(
        {},
        {
          algorithm: 'RS256',
          privateKey: this.privateKey,
          expiresIn: this.jwtConf.access_ttl,
          issuer: this.jwtConf.issuer,
        },
      ),
    };
  }

  async verify(token: string): Promise<UserJwtDataDto> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new RequestTimeoutException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new ForbiddenException('Invalid JWT token');
      } else {
        throw new InternalServerErrorException('Token validation error');
      }
    }
  }

  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: this.privateKey,
      expiresIn: this.jwtConf.refresh_ttl,
      issuer: this.jwtConf.issuer,
    });
  }

  private generateAccessToken(payload: UserJwtDataDto): string {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: this.privateKey,
      expiresIn: this.jwtConf.access_ttl,
      issuer: this.jwtConf.issuer,
    });
  }
}
