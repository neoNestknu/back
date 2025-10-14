import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ConfigType } from '@nestjs/config';
import appConfig from "../config/app.config";
import {KEYS} from "../constants/constants";
import {UserJwtDataDto} from "../dto/user-jwt-data.dto";

export class JwtPayload extends UserJwtDataDto {
  exp: number;
  iss: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(
        path.join(
          __dirname,
          `../../../../shared/public-key/${KEYS[appConf.node_env].public_key}`,
        ),
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return payload as UserJwtDataDto;
  }
}
