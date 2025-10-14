import {BadRequestException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {SignUserDto} from "../../dto/sign-user.dto";
import {HashingService} from "./hashing/hashing.service";
import {JwtAuthService} from "./jwt/jwt.service";
import { Response, Request } from 'express';
import jwtConfig from "../../config/jwt.config";
import {ConfigType} from "@nestjs/config";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
      private readonly hashingService: HashingService,
      private readonly jwtAuthService: JwtAuthService,
      @Inject(jwtConfig.KEY) private readonly jwtConf: ConfigType<typeof jwtConfig>,
      private readonly userService: UserService,
  ) {}

  async signUp(data: SignUserDto, res: Response) {
    await this.validateUserExist(data.email);
    data.password = await this.hashingService.setHash(data.password);
    const dataValues = await this.userService.create(data);
    const tokens = this.jwtAuthService.generateTokens({sub: dataValues.id})

    res = this.setTokenInCookie(res, tokens.refreshToken);
    return res.json({accessToken: tokens.accessToken});
  }

  async signIn(data: SignUserDto, res: Response) {
    const dataValues = await this.userService.findByEmail(data.email);
    await this.validatePassword(data.password, dataValues.password);
    const tokens = this.jwtAuthService.generateTokens({
      sub: dataValues.id,
    });

    res = this.setTokenInCookie(res, tokens.refreshToken);
    return res.json({accessToken: tokens.accessToken});
  }

  async refresh(token: string, res: Response) {
    const data = await this.jwtAuthService.verify(token);
    const userDataValues = await this.userService.findById(data.sub);
    const tokens = this.jwtAuthService.generateTokens({
      sub: userDataValues.id,
    });

    res = this.setTokenInCookie(res, tokens.refreshToken);
    return res.json({accessToken: tokens.accessToken});
  }

  async logout(token: string, res: Response) {
    if (typeof token === 'undefined') {
      return res.status(HttpStatus.OK).json({});
    }
    res.clearCookie('refreshToken');
    return res.status(HttpStatus.OK).json({});
  }

  async forgotPassword(email: string): Promise<void> {}

  private async validateUserExist(email: string): Promise<void> {}

  private setTokenInCookie(res: Response, refreshToken: string) {
    return res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.jwtConf.refresh_ttl,
    });
  }

  private async validatePassword(
      password: string,
      hashedPassword: string,
  ): Promise<void> {
    if (!(await this.hashingService.compareHash(password, hashedPassword))) {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
