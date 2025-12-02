import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ForgotMailDto } from '../../dto/forgot_mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('forgot')
  async forgotMail(@Body() data: ForgotMailDto) {
    return await this.mailService.forgotMail(data);
  }
}
