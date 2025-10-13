import { BcryptService } from './bcrypt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { compare, genSalt, hash } from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash text correctly', async () => {
    const text = 'password';
    const salt = 'randomSalt';
    const hashedText = 'hashedPassword';

    (genSalt as jest.Mock).mockResolvedValue(salt);
    (hash as jest.Mock).mockResolvedValue(hashedText);

    const result = await service.setHash(text);

    expect(genSalt).toHaveBeenCalled();
    expect(hash).toHaveBeenCalledWith(text, salt);
    expect(result).toBe(hashedText);
  });

  it('should compare hash correctly', async () => {
    const text = 'password';
    const hashedText = 'hashedPassword';

    (compare as jest.Mock).mockResolvedValue(true);

    const result = await service.compareHash(text, hashedText);

    expect(compare).toHaveBeenCalledWith(text, hashedText);
    expect(result).toBe(true);
  });

  it('should return false for incorrect comparison', async () => {
    const text = 'password';
    const hashedText = 'hashedPassword';

    (compare as jest.Mock).mockResolvedValue(false);

    const result = await service.compareHash(text, hashedText);

    expect(compare).toHaveBeenCalledWith(text, hashedText);
    expect(result).toBe(false);
  });
});
