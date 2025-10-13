import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract setHash(text: string): Promise<string>;
  abstract compareHash(text: string, hash: string): Promise<boolean>;
}
