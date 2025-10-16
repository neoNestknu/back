import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { LinkDto } from '../activation-link/dto/link.dto';
import { UserJwtDataDto } from '../../dto/user-jwt-data.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenGuard } from '../../guards/refresh-token/refresh-token.guard';
import { JwtTokensDto } from '../../dto/jwt-tokens.dto';

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockAuthService = {
    signUp: jest.fn(),
    requestLogin: jest.fn(),
    signIn: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RefreshTokenGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleSignUp', () => {
    it('should call authService.signUp and return the result', async () => {
      const userDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };
      const signUpResult = { message: 'User signed up successfully' };
      mockAuthService.signUp.mockResolvedValue(signUpResult);

      const result = await controller.handleSignUp(userDto);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(signUpResult);
    });
  });

  describe('handleRequestLogin', () => {
    it('should call authService.requestLogin and return void', async () => {
      const userDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const result = await controller.handleRequestLogin(userDto);

      expect(mockAuthService.requestLogin).toHaveBeenCalledWith(userDto);
      expect(result).toBeUndefined();
    });
  });

  describe('handleSignIn', () => {
    it('should call authService.activate and return the result', async () => {
      const linkDto: LinkDto = { link: 'activation-token' };
      const jwtTokensResult: JwtTokensDto = {
        refreshToken: 'refresh-token',
        accessToken: 'access-token',
      };

      mockAuthService.signIn.mockResolvedValue(jwtTokensResult);

      const result = await controller.handleSignIn(linkDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(linkDto);
      expect(result).toEqual(jwtTokensResult);
    });
  });

  describe('handleRefresh', () => {
    it('should call authService.refresh and return the result', async () => {
      const userJwtData: UserJwtDataDto = {
        sub: '1',
      };
      const refreshResult = { message: 'Token refreshed successfully' };
      mockAuthService.refresh.mockResolvedValue(refreshResult);

      const result = await controller.handleRefresh(userJwtData);
      expect(mockAuthService.refresh).toHaveBeenCalledWith(userJwtData);
      expect(result).toEqual(refreshResult);
    });
  });

  describe('handleLogout', () => {
    it('should call authService.logout and return the result', async () => {
      const token = 'test token';
      const logoutResult = 'success';
      mockAuthService.logout.mockResolvedValue(logoutResult);
      const result = await controller.handleLogout(token);
      expect(mockAuthService.logout).toHaveBeenCalledWith(token);
      expect(result).toEqual(logoutResult);
    });
  });
});
