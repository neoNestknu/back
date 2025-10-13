import { JwtAuthService } from './jwt-auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import jwtConfig from '../../../config/jwt.config';
import appConfig from '../../../config/app.config';

jest.mock('fs');
jest.mock('../../../constants/constants', () => ({
  KEYS: {
    test: {
      private_key: 'dev_private.pem',
    },
  },
}));

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockJwtConfig = {
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    issuer: 'my-app',
  };

  const mockAppConfig = {
    node_env: 'test',
  };

  beforeEach(async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('mocked-private-key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: jwtConfig.KEY, useValue: mockJwtConfig },
        { provide: appConfig.KEY, useValue: mockAppConfig },
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate both access and refresh tokens', () => {
    const payload = { sub: '123' };
    mockJwtService.sign
      .mockReturnValueOnce('refreshToken')
      .mockReturnValueOnce('accessToken');

    const result = service.generateTokens(payload);

    expect(result.accessToken).toBe('accessToken');
    expect(result.refreshToken).toBe('refreshToken');
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('should generate access token only', () => {
    const payload = { sub: '456' };
    mockJwtService.sign.mockReturnValue('access-token');

    const result = service.getAccessToken(payload);

    expect(result.accessToken).toBe('access-token');
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      payload,
      expect.objectContaining({
        algorithm: 'RS256',
        expiresIn: mockJwtConfig.expiresIn,
        issuer: mockJwtConfig.issuer,
      }),
    );
  });

  it('should verify token and return payload', async () => {
    const payload = { sub: '789', exp: 123456 };
    mockJwtService.verifyAsync.mockResolvedValue(payload);

    const result = await service.verifyAsync('some-token');

    expect(result).toEqual(payload);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('some-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
