import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE_CLIENT,
  TYPE_MAIL,
} from '../../constants/constants';
import { HashingService } from './hashing/hashing.service';
import { firstValueFrom } from 'rxjs';
import { JwtAuthService } from './jwt-auth/jwt-auth.service';
import { UserJwtDataDto } from '../../dto/user-jwt-data.dto';
import { JwtPayload } from '../../dto/jwt-payload.dto';
import { AccessTokenDto } from '../../dto/access-token.dto';
import { JwtTokensDto } from '../../dto/jwt-tokens.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    @Inject(NOTIFICATION_SERVICE_CLIENT)
    private readonly hashingService: HashingService,
  ) {}

  async signUp(data: CreateUserDto): Promise<void> {
    await this.validateUserExist(data.email);
    data.password = await this.hashingService.setHash(data.password);
    const dataValues = await this.userService.createUser(data);

    const link = await this.linkService.create({
      userId: dataValues.id,
      type: 'registration',
    });
    await this.sendMail(dataValues.email, TYPE_MAIL.ACTIVATE_ACCOUNT, link.id);
    return;
  }

  async requestLogin(data: CreateUserDto): Promise<void> {
    await this.validateActivateUser(data.email);
    const dataValues = await this.userService.findUser(data.email);
    await this.validatePassword(data.password, dataValues.password);

    const link = await this.linkService.create({
      userId: dataValues.id,
      type: 'login',
    });

    await this.sendMail(dataValues.email, TYPE_MAIL.ACTIVATE_ACCOUNT, link.id);
    return;
  }

  async signIn(data: LinkDto): Promise<JwtTokensDto> {
    const dataValues = await this.linkService.findOne(data);
    const tokens = this.jwtAuthService.generateTokens({
      sub: dataValues.userId,
    });

    await this.linkService.delete(dataValues);
    return tokens;
  }

  async refresh(data: UserJwtDataDto): Promise<AccessTokenDto> {
    return this.jwtAuthService.getAccessToken(data);
  }

  async logout(token: string): Promise<void> {
    try {
      const data: JwtPayload = await this.jwtAuthService.verifyAsync(token);
      const expires: number = data.exp * 1000 - Date.now();
      if (expires > 0) {
        await this.redisService.addRevokedToken(token, expires);
      }
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const dataValues = await this.validateUser(email);
    const link = await this.linkService.create({
      userId: dataValues.id,
      type: 'password_reset',
    });
    await this.sendMail(dataValues.email, TYPE_MAIL.FORGOT_PASSWORD, link.id);
    return;
  }

  async setNewPassword(data: SetNewPasswordDto): Promise<void> {
    const link = await this.linkService.findOne({ link: data.link });
    const dataValues = await this.userService.findUserById(link.userId);
    if (!dataValues) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    dataValues.password = data.password;
    await dataValues.save();
    return;
  }

  private async validateUserExist(email: string): Promise<void> {
    const dataValues = await this.userService.findUser(email);
    if (dataValues) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      });
    }
  }

  private async validateUser(email: string): Promise<User> {
    const dataValues = await this.userService.findUser(email);
    if (!dataValues) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      });
    }
    return dataValues;
  }

  private async validateActivateUser(email: string): Promise<void> {
    const dataValues = await this.userService.findUser(email);
    if (!dataValues.isActivated || !dataValues) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'User account is not activated',
      });
    }
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    if (!(await this.hashingService.compareHash(password, hashedPassword))) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      });
    }
  }

  private async sendMail(
    email: string,
    type: TYPE_MAIL,
    link: string,
  ): Promise<any> {
    try {
      return await firstValueFrom(
        this.notificationClient.send('send_mail', {
          email: email,
          type: type,
          link: link,
        }),
      );
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'message' in error
      ) {
        throw new RpcException({
          status: error.status,
          message: error.message,
        });
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred',
      });
    }
  }
}
