import { Body, Controller, Post } from '@nestjs/common';
import { ForgotMailDto } from '../../dto/forgot_mail.dto';

@Controller('mail')
export class DevMailController {
  @Post('forgot')
  async forgotMail(@Body() data: ForgotMailDto) {
    console.log(`MAIL: ${data.id}`);
    return;
  }
}
