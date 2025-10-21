import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export function IsPasswordDecorator(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: 'Password is required' }),
    MinLength(6, {
      message: 'Password must be at least 10 characters long',
    }),
    MaxLength(20, {
      message: 'Password must not exceed 20 characters',
    }),
    Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/, {
      message:
        'Password must contain at least one letter and can only include English letters and numbers',
    }),
  );
}
