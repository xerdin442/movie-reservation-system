import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Cinema } from '@src/cinema/entities/cinema.entity';
import { Request } from 'express';

export const GetCinema = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>() as Record<
      string,
      any
    >;

    return request.user as Cinema;
  },
);
