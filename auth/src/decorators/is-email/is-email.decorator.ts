import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export function IsEmailDecorator(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: 'Email address is required' }),
    IsEmail({}, { message: 'Invalid email format' }),
  );
}
