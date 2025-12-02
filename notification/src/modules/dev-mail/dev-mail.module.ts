import { Module } from '@nestjs/common';
import { DevMailController } from './dev-mail.controller';

@Module({
  controllers: [DevMailController],
  providers: [],
})
export class DevMailModule {}
