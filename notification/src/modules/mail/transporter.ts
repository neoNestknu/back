import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import smtpConfig from '../../config/smtp.config';

export const TRANSPORTER_TOKEN = 'MAIL_TRANSPORTER';

export const TRANSPORTER: Provider = {
  provide: TRANSPORTER_TOKEN,
  inject: [smtpConfig.KEY],
  useFactory: (smtpConf: ConfigType<typeof smtpConfig>) => {
    return nodemailer.createTransport({
      host: smtpConf.host,
      port: smtpConf.port,
      secure: false,
      auth: {
        user: smtpConf.user,
        pass: smtpConf.pass,
      },
    } as nodemailer.TransportOptions);
  },
};
