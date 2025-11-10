import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { AuthenticatedRequest, AuthenticatedUser } from '@src/common/types';
import { Request } from 'express';
import { OrganizationService } from '@src/organization/organization.service';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Extract the required roles for this route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Allow access if no route is not restricted to any role
    if (!requiredRoles) return true;

    // Get details of authenticated user
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Check if user's role matches any of the the required roles
    const hasRole = requiredRoles.includes(user.role!);
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}

export class ApiKeyGuard implements CanActivate {
  constructor(private readonly orgService: OrganizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract API key from request header
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) throw new UnauthorizedException('Missing API key');

    // Check if API key is valid
    const organization = await this.orgService.findByApiKey(apiKey as string);

    // Populate request object with Organization details
    const user: AuthenticatedUser = { ...organization };
    request.user = user;

    return true;
  }
}
