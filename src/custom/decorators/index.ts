import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtValidatedPayload } from '@src/common/types';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: JwtValidatedPayload;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);
