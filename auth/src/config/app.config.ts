import { registerAs } from '@nestjs/config';
import process from 'node:process';

export default registerAs('app', () => ({
  node_env: String(process.env.NODE_ENV),
  port: Number(process.env.PORT),
}));
