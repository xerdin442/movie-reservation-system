import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  AuthenticatedUser,
  AuthRole,
} from '@src/common/types';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);

export const GetOrganization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user as AuthenticatedUser;
  },
);

export const ROLES_KEY = 'auth_roles';
export const Roles = (...roles: AuthRole[]) => SetMetadata(ROLES_KEY, roles);
