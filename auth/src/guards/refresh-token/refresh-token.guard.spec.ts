import { RefreshTokenGuard } from './refresh-token.guard';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<RefreshTokenGuard>(RefreshTokenGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should allow access if refresh token is valid', async () => {
    const mockContext = {
      switchToRpc: () => ({
        getData: () => ({ refreshToken: 'Bearer valid-token' }),
        getContext: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const mockUser = { sub: 'userId123' };
    mockJwtService.verifyAsync.mockResolvedValue(mockUser);

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
  });

  it('should throw an error if no refresh token is provided', async () => {
    const mockContext = {
      switchToRpc: () => ({
        getData: () => ({}),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      'Refresh token not found',
    );
  });

  it('should throw an error if token verification fails', async () => {
    const mockContext = {
      switchToRpc: () => ({
        getData: () => ({ refreshToken: 'Bearer invalid-token' }),
        getContext: () => ({}),
      }),
    } as unknown as ExecutionContext;

    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      'Invalid token',
    );
  });
});
