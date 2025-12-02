import { Inject, Injectable } from '@nestjs/common';
import {
  MAIL_SUBJECT,
  MAIL_TEXT,
  MAIL_TYPE,
} from './constants/builder.constants';
import smtpConfig from '../../config/smtp.config';
import { ConfigType } from '@nestjs/config';
import { MailByFormat } from '../../dto/mail_by_format.dto';
import { BuiltMail } from '../../dto/built_mail.dto';

@Injectable()
export class BuilderService {
  constructor(
    @Inject(smtpConfig.KEY)
    private readonly smtpConf: ConfigType<typeof smtpConfig>,
  ) {}

  build(data: any, type: MAIL_TYPE): BuiltMail {
    switch (type) {
      case MAIL_TYPE.FORGOT_PASSWORD:
        return {
          from: this.smtpConf.user,
          ...this.buildForgotMail(data),
        };
      default:
        throw new Error('Mail type not found');
    }
  }

  private buildForgotMail(data: any): MailByFormat {
    return {
      subject: MAIL_SUBJECT.FORGOT_PASSWORD,
      text: this.format(MAIL_TEXT.FORGOT_PASSWORD, { url: data.url }),
    };
  }

  private format(template: string, params: Record<string, string>) {
    return Object.entries(params).reduce(
      (str, [key, value]) => str.replaceAll(`{${key}}`, value),
      template,
    );
  }
}
