import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  async setHash(text: string): Promise<string> {
    const salt = await genSalt();
    return hash(text, salt);
  }

  compareHash(text: string, hash: string): Promise<boolean> {
    return compare(text, hash);
  }
}
