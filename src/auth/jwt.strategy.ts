import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Secrets } from '@src/common/secrets';
import logger from '@src/common/logger';
import { AuthRole, AuthenticatedUser } from '@src/common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly context = JwtStrategy.name;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: Secrets.JWT_SECRET,
    });
  }

  validate(payload: Record<string, any>): AuthenticatedUser {
    try {
      // Prompt user to login if token has expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        throw new UnauthorizedException(
          `Session expired. Please log in. Role: ${payload.role}`,
        );
      }

      return {
        id: payload.sub as number,
        email: payload.email as string,
        role: payload.role as AuthRole,
      };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred while validating JWT authorization token. Error: ${error.message}\n`,
      );

      throw error;
    }
  }
}
