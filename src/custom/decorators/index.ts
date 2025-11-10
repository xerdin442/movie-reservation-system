import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AuthenticatedRequest } from '@src/common/types';
import { UserRole } from '@src/db/enums';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);

export const ROLES_KEY = 'auth_roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
