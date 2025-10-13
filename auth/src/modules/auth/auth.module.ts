import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { KEYS } from '../../constants/constants';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { JwtAuthService } from './jwt-auth/jwt-auth.service';
import jwtConfig from '../../config/jwt.config';
import appConfig from '../../config/app.config';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthService,
    JwtAuthService,
  ],
  imports: [
    ConfigModule.forRoot({ load: [jwtConfig, appConfig] }),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forFeature(appConfig),
      ],
      inject: [jwtConfig.KEY, appConfig.KEY],
      useFactory: (
        jwtConf: ConfigType<typeof jwtConfig>,
        appConf: ConfigType<typeof appConfig>,
      ) => {
        const env = appConf.node_env;

        const privateKeyPath = path.join(
          __dirname,
          `../../config/keys/${KEYS[env].private_key}`,
        );

        const publicKeyPath = path.join(
          __dirname,
          `../../config/keys/${KEYS[env].public_key}`,
        );

        return {
          privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
          publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
          signOptions: {
            algorithm: 'RS256',
            issuer: jwtConf.issuer,
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
