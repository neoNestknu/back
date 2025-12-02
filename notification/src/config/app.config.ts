import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.PORT),
  node_env: String(process.env.NODE_ENV),
}));
