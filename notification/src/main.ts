import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('notification');

  const configService = app.get(ConfigService);
  const appConf: ConfigType<typeof appConfig> = configService.get('app');

  if (!appConf) {
    throw new Error('app config is not found');
  }

  await app.listen(appConf.port);
}

bootstrap();
