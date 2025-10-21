import { registerAs } from '@nestjs/config';
import process from 'node:process';

export default registerAs('postgres', () => ({
  db_name: String(process.env.POSTGRES_DB),
  host: String(process.env.POSTGRES_HOST),
  port: Number(process.env.POSTGRES_PORT),
  user: String(process.env.APP_USER_NAME),
  password: String(process.env.APP_USER_PASSWORD),
}));
