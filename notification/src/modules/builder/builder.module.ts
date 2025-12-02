import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import { ConfigModule } from '@nestjs/config';
import smtpConfig from '../../config/smtp.config';

@Module({
  imports: [ConfigModule.forRoot({ load: [smtpConfig] })],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
