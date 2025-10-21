import { HashingService } from './hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt/bcrypt.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HashingService,
          useClass: BcryptService,
        },
      ],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash text using setHash', async () => {
    const text = 'password';
    const hashedText = 'hashedPassword';

    jest.spyOn(service, 'setHash').mockResolvedValue(hashedText);

    const result = await service.setHash(text);

    expect(result).toBe(hashedText);
  });

  it('should compare hash using compareHash', async () => {
    const text = 'password';
    const hashedText = 'hashedPassword';

    jest.spyOn(service, 'compareHash').mockResolvedValue(true);

    const result = await service.compareHash(text, hashedText);

    expect(result).toBe(true);
  });
});
