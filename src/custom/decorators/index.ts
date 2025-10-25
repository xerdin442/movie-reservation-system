import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AuthenticatedRequest, AuthRole } from '@src/common/types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);

export const ROLES_KEY = 'auth_roles';
export const Roles = (...roles: AuthRole[]) => SetMetadata(ROLES_KEY, roles);
