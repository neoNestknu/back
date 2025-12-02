import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TRANSPORTER_TOKEN } from './transporter';
import { BuilderService } from '../builder/builder.service';
import { ForgotMailDto } from '../../dto/forgot_mail.dto';
import { MAIL_TYPE } from '../builder/constants/builder.constants';

@Injectable()
export class MailService {
  constructor(
    @Inject(TRANSPORTER_TOKEN)
    private readonly transporter: nodemailer.Transporter,
    private readonly builderService: BuilderService,
  ) {}

  async forgotMail(data: ForgotMailDto) {
    await this.sendMail(
      this.builderService.build(data, MAIL_TYPE.FORGOT_PASSWORD),
    );
  }

  private async sendMail(data: any) {
    return this.transporter.sendMail(data);
  }
}
