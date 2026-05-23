import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

import type { AccessTokenPayload } from 'src/auth/interfaces/access-token-payload.interface';

type RequestWithUser = Request &
  Record<typeof REQUEST_USER_KEY, AccessTokenPayload>;

export const ActiveUser = createParamDecorator(
  (
    field: keyof AccessTokenPayload | undefined,
    ctx: ExecutionContext,
  ): AccessTokenPayload | AccessTokenPayload[keyof AccessTokenPayload] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    const user = request[REQUEST_USER_KEY];
    return field ? user[field] : user;
  },
);
