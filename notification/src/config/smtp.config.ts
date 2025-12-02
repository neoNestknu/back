import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('smtp', () => ({
  host: String(process.env.SMTP_HOST),
  port: Number(process.env.SMTP_PORT),
  user: String(process.env.SMTP_USER),
  pass: String(process.env.SMTP_PASS),
}));
