import {IsEmailDecorator} from "../decorators/is-email/is-email.decorator";
import {IsPasswordDecorator} from "../decorators/is-password/is-password.decorator";

export class SignUserDto {
  @IsEmailDecorator()
  email: string;

  @IsPasswordDecorator()
  password: string;
}
