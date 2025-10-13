import { UserJwtDataDto } from './user-jwt-data.dto';

export class JwtPayload extends UserJwtDataDto {
  exp: number;
  iss: string;
}
