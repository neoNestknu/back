import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {UsersProviders} from "./users.providers";

@Module({
  exports: [UserService],
  providers: [UserService, ...UsersProviders]
})
export class UserModule {}
