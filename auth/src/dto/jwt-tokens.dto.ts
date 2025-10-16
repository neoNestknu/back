import { AccessTokenDto } from './access-token.dto';

export class JwtTokensDto extends AccessTokenDto {
  refreshToken: string;
}
