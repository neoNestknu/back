import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { TRANSPORTER } from './transporter';
import { ConfigModule } from '@nestjs/config';
import transporterConfig from '../../config/smtp.config';
import { BuilderModule } from '../builder/builder.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [transporterConfig] }), BuilderModule],
  controllers: [MailController],
  providers: [MailService, TRANSPORTER],
})
export class MailModule {}
