import { IsEmail, IsUUID } from 'class-validator';

export class ForgotMailDto {
  @IsEmail()
  to: string;

  @IsUUID('4')
  id: string;
}
