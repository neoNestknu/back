import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
import postgresConfig from '../../config/postgres.config';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [ConfigModule.forRoot({ load: [appConfig, postgresConfig] })],
})
export class DatabaseModule {}
