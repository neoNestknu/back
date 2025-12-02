import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app.config';
import { MailModule } from './mail/mail.module';
import { DevMailModule } from './dev-mail/dev-mail.module';
import { BuilderModule } from './builder/builder.module';
import { HealthModule } from './health/health.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig] }),
    process.env.NODE_ENV === 'development' ? DevMailModule : MailModule,
    BuilderModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
