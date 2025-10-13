import { registerAs } from '@nestjs/config';
import process from 'node:process';

export default registerAs('jwt', () => ({
  issuer: String(process.env.JWT_TOKEN_ISSUER),
  expiresIn: Number(process.env.JWT_ACCESS_TOKEN_TTL),
  refreshExpiresIn: Number(process.env.JWT_REFRESH_TOKEN_TTL),
}));
