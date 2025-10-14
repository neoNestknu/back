import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {UserJwtDataDto} from "../../dto/user-jwt-data.dto";

export const UserData = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as UserJwtDataDto;
    },
);
