import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import * as process from 'node:process';
import { ConfigService, ConfigType } from '@nestjs/config';
import { testConnection } from './modules/database/test.connection';
import { ValidationPipe } from '@nestjs/common';
import postgresConfig from './config/postgres.config';
import appConfig from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const postgresConf: ConfigType<typeof postgresConfig> =
    configService.get('postgres');
  const appConf: ConfigType<typeof appConfig> = configService.get('app');

  if (!postgresConf || !appConf) {
    throw new Error('Missing configuration values');
  }
  app.useGlobalPipes(
    new ValidationPipe(),
  );
  await testConnection(postgresConf, appConf);
  await app.listen(appConf.port);
}
bootstrap();
