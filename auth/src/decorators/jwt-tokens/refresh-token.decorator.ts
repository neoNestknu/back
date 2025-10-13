import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshTokenDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    return request.refreshToken;
  },
);
